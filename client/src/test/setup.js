import '@testing-library/jest-dom';

// framer-motion's useInView requires IntersectionObserver which jsdom lacks
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    constructor(cb) { this._cb = cb; }
    observe()    {}
    unobserve()  {}
    disconnect() {}
  };
}
