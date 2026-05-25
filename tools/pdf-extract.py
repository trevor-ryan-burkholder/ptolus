#!/usr/bin/env python3
"""Per-font text extractor for the Ptolus source PDFs (stdlib only).

Why this exists: the source PDFs use subset fonts, so raw content strings are
gibberish without each font's ToUnicode CMap. A *global* merge of all CMaps
corrupts numbers (colliding subset codes overwrite each other: 4d8->4dU, +4->K4,
minus dropped) -- useless for stat blocks. This decoder instead tracks the
`/Fn Tf` operator and decodes each text run with THAT font's own ToUnicode map,
so digits and signs come out correct. Verified against 3.5 BAB+Str+size math;
used to transcribe the Ptolus-native bestiary into srd/monsters/monsters.json.

Scope: works on the core book (epdf.pub_ptolus-city-by-the-spire-d20-system.pdf)
which has classic `N G obj` + `xref` structure (no object/xref streams). The
"Night of Dissolution" PDF does NOT extract (0 Flate streams matched).

Usage:  python3 tools/pdf-extract.py <input.pdf> <output.txt>
Output is one decoded text blob per page, separated by `\\f[PDFPAGE seq obj]`
markers (page order follows the /Pages tree). The bestiary is the "Monsters"
chapter (printed p. 619+, PDF page seqs ~519-549). Residual quirks: occasional
missing spaces between words ("4d8Hit"); two-column stat blocks interleave
fields, so disentangle by column. sources/ is gitignored -- never commit PDFs.
"""
import re
import sys
import zlib

if len(sys.argv) != 3:
    sys.exit("usage: pdf-extract.py <input.pdf> <output.txt>")

data = open(sys.argv[1], "rb").read()
OUT = sys.argv[2]

# ---- 1) index objects (careful stream handling; last definition wins) ----
obj_body, obj_stream = {}, {}
for m in re.finditer(rb"(?:^|[\r\n\x00])\s*(\d+)\s+(\d+)\s+obj\b", data):
    num = int(m.group(1)); start = m.end()
    s_pos = data.find(b"stream", start)
    e_pos = data.find(b"endobj", start)
    if e_pos == -1:
        continue
    if s_pos != -1 and s_pos < e_pos:
        body = data[start:s_pos]
        nl = data.find(b"\n", s_pos)
        sstart = nl + 1
        send = data.find(b"endstream", sstart)
        raw = data[sstart:send] if send != -1 else b""
        stream = None
        for cand in (raw, raw.rstrip(b"\r\n")):
            try:
                stream = zlib.decompress(cand); break
            except Exception:
                pass
        obj_body[num] = body
        if stream is not None:
            obj_stream[num] = stream
    else:
        obj_body[num] = data[start:e_pos]


def body(n):
    return obj_body.get(n, b"")


def ref(b, key):
    m = re.search(rb"/" + key + rb"\s+(\d+)\s+\d+\s+R", b)
    return int(m.group(1)) if m else None


def balanced_dict(buf, start):  # buf[start:start+2] == '<<'
    depth = 0; i = start; n = len(buf)
    while i < n - 1:
        two = buf[i:i + 2]
        if two == b"<<":
            depth += 1; i += 2
        elif two == b">>":
            depth -= 1; i += 2
            if depth == 0:
                return buf[start:i]
        else:
            i += 1
    return buf[start:]


# ---- 2) per-font ToUnicode cmaps ----
def parse_cmap(t):
    cmap = {}; widths = set()
    for blk in re.findall(rb"beginbfchar(.*?)endbfchar", t, re.S):
        for sm in re.finditer(rb"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", blk):
            src = sm.group(1); widths.add(len(src) // 2)
            try:
                u = bytes.fromhex(sm.group(2).decode()).decode("utf-16-be")
            except Exception:
                u = ""
            cmap[int(src, 16)] = u
    for blk in re.findall(rb"beginbfrange(.*?)endbfrange", t, re.S):
        for sm in re.finditer(rb"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", blk):
            src = sm.group(1); widths.add(len(src) // 2)
            lo = int(src, 16); hi = int(sm.group(2), 16)
            try:
                base = ord(bytes.fromhex(sm.group(3).decode()).decode("utf-16-be")[0])
            except Exception:
                base = 0
            for i in range(hi - lo + 1):
                try:
                    cmap[lo + i] = chr(base + i)
                except Exception:
                    cmap[lo + i] = ""
        for sm in re.finditer(rb"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*\[(.*?)\]", blk, re.S):
            lo = int(sm.group(1), 16)
            for i, dh in enumerate(re.findall(rb"<([0-9A-Fa-f]+)>", sm.group(3))):
                try:
                    cmap[lo + i] = bytes.fromhex(dh.decode()).decode("utf-16-be")
                except Exception:
                    cmap[lo + i] = ""
    width = 2 if (2 in widths and 1 not in widths) else 1
    return cmap, width


font_cmap = {}
for num, b in obj_body.items():
    if b"/ToUnicode" in b:
        tu = ref(b, b"ToUnicode")
        if tu in obj_stream:
            font_cmap[num] = parse_cmap(obj_stream[tu])


# ---- 3) string decoding ----
def lit_bytes(s):
    out = bytearray(); i = 0; n = len(s)
    esc = {0x6e: 0x0a, 0x72: 0x0d, 0x74: 0x09, 0x62: 0x08, 0x66: 0x0c, 0x28: 0x28, 0x29: 0x29, 0x5c: 0x5c}
    while i < n:
        c = s[i]
        if c == 0x5c:
            i += 1
            if i >= n:
                break
            e = s[i]
            if e in esc:
                out.append(esc[e]); i += 1
            elif 0x30 <= e <= 0x37:
                j = 0; val = 0
                while j < 3 and i + j < n and 0x30 <= s[i + j] <= 0x37:
                    val = val * 8 + (s[i + j] - 0x30); j += 1
                out.append(val & 0xFF); i += j
            elif e in (0x0a, 0x0d):
                i += 1
            else:
                out.append(e); i += 1
        else:
            out.append(c); i += 1
    return bytes(out)


def dec(b, cw):
    if not cw:
        return "".join((chr(x) if 32 <= x < 127 else "") for x in b)
    cmap, width = cw; out = []
    if width == 2:
        for i in range(0, len(b) - 1, 2):
            out.append(cmap.get((b[i] << 8) | b[i + 1], ""))
    else:
        for x in b:
            if x in cmap:
                out.append(cmap[x])
            elif x == 0x20:
                out.append(" ")
            elif 32 <= x < 127:
                out.append(chr(x))
    return "".join(out)


# ---- 4) page resources (with /Pages inheritance) ----
def font_map_from_resources(res):
    m = re.search(rb"/Font\s+(\d+)\s+\d+\s+R", res)
    if m:
        fd = body(int(m.group(1)))
    else:
        m = re.search(rb"/Font\s*<<", res)
        if not m:
            return {}
        fd = balanced_dict(res, m.start() + res[m.start():].find(b"<<"))
    out = {}
    for sm in re.finditer(rb"/([A-Za-z0-9_.+\-]+)\s+(\d+)\s+\d+\s+R", fd):
        out[sm.group(1).decode()] = int(sm.group(2))
    return out


def node_fontmap(b, inherited):
    if b"/Resources" in b:
        m = re.search(rb"/Resources\s+(\d+)\s+\d+\s+R", b)
        res = body(int(m.group(1))) if m else None
        if res is None:
            m = re.search(rb"/Resources\s*<<", b)
            if m:
                res = balanced_dict(b, m.start() + b[m.start():].find(b"<<"))
        if res:
            fm = font_map_from_resources(res)
            if fm:
                return fm
    return inherited or {}


def contents(b):
    m = re.search(rb"/Contents\s+(\d+)\s+\d+\s+R", b)
    if m:
        refs = [int(m.group(1))]
    else:
        m = re.search(rb"/Contents\s*\[(.*?)\]", b, re.S)
        refs = [int(x.group(1)) for x in re.finditer(rb"(\d+)\s+\d+\s+R", m.group(1))] if m else []
    return b"".join(obj_stream.get(r, b"") for r in refs)


TXT = re.compile(
    rb"/([A-Za-z0-9_.+\-]+)\s+[-\d.]+\s+Tf"
    rb"|\(((?:[^()\\]|\\.)*)\)\s*(?:Tj|'|\")"
    rb"|<([0-9A-Fa-f\s]+)>\s*Tj"
    rb"|\[((?:[^\[\]\\]|\\.)*)\]\s*TJ", re.S)


def decode_content(content, fm):
    out = []; cur = None
    for m in TXT.finditer(content):
        if m.group(1) is not None:
            cur = font_cmap.get(fm.get(m.group(1).decode()))
        elif m.group(2) is not None:
            out.append(dec(lit_bytes(m.group(2)), cur))
        elif m.group(3) is not None:
            hx = re.sub(rb"\s+", b"", m.group(3))
            if len(hx) % 2 == 0:
                out.append(dec(bytes.fromhex(hx.decode()), cur))
        elif m.group(4) is not None:
            for sm in re.finditer(rb"\(((?:[^()\\]|\\.)*)\)|<([0-9A-Fa-f\s]+)>", m.group(4)):
                if sm.group(1) is not None:
                    out.append(dec(lit_bytes(sm.group(1)), cur))
                else:
                    hx = re.sub(rb"\s+", b"", sm.group(2))
                    if len(hx) % 2 == 0:
                        out.append(dec(bytes.fromhex(hx.decode()), cur))
    return "".join(out)


# ---- 5) page order via tree walk ----
order = []
roots = re.findall(rb"/Root\s+(\d+)\s+\d+\s+R", data)
proot = ref(body(int(roots[-1])), b"Pages") if roots else None
seen = set()


def walk(num, inh):
    if num in seen:
        return
    seen.add(num); b = body(num); fm = node_fontmap(b, inh)
    if re.search(rb"/Type\s*/Pages\b", b):
        kids = re.search(rb"/Kids\s*\[(.*?)\]", b, re.S)
        if kids:
            for km in re.finditer(rb"(\d+)\s+\d+\s+R", kids.group(1)):
                walk(int(km.group(1)), fm)
    elif re.search(rb"/Type\s*/Page\b", b):
        order.append((num, fm))


if proot:
    walk(proot, {})
if not order:
    for n, b in obj_body.items():
        if re.search(rb"/Type\s*/Page\b", b) and not re.search(rb"/Type\s*/Pages\b", b):
            order.append((n, node_fontmap(b, {})))
    order.sort()

with open(OUT, "w", encoding="utf-8") as f:
    for seq, (num, fm) in enumerate(order, 1):
        f.write("\n\f[PDFPAGE %d obj %d]\n" % (seq, num))
        f.write(decode_content(contents(body(num)), fm))

print("objects:", len(obj_body), "| fonts w/cmap:", len(font_cmap), "| pages:", len(order))
