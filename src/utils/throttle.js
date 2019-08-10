export default function ThrottleConstructor(fn, interval = 0) {
  let timer;
  let wraper;
  function Throttle(...args) {
    if (timer) clearTimeout(timer);
    wraper = () => {
      fn(...args);
    };
    timer = setTimeout(wraper, interval);
  }
  function Clear() {
    clearTimeout(timer);
    wraper();
  }
  return {
    Throttle, Clear,
  };
}
