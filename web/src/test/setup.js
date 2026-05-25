import '@testing-library/jest-dom';

// jsdom stubs so tool handlers (copy, download, confirm-gated actions) don't throw
window.confirm = () => true;
window.alert = () => {};
window.prompt = () => null;
window.scrollTo = () => {};
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.resolve() }, configurable: true });
}
if (!URL.createObjectURL) URL.createObjectURL = () => 'blob:mock';
if (!URL.revokeObjectURL) URL.revokeObjectURL = () => {};
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
