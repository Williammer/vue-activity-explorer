export function throttle(fn, wait) {
  let waitTimer;
  const clear = () => {
    clearTimeout(waitTimer);
    waitTimer = null;
  };
  const start = (...args) => {
    waitTimer = setTimeout(() => {
      fn(...args);
      clear();
    }, wait);
  };

  const throttled = (...args) => {
    if (waitTimer) {
      return;
    }
    start(...args);
  };
  throttled.cancel = clear;

  return throttled;
}
