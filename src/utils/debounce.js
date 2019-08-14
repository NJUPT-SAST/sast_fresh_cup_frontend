export default function DebounceConstructor(fn, interval = 0) {
  let timer;
  let wraper;
  function Debounce(...args) {
    if (timer) clearTimeout(timer);
    wraper = () => {
      fn(...args);
      timer = undefined;
    };
    timer = setTimeout(wraper, interval);
  }
  function Clear() {
    if (timer !== undefined) {
      clearTimeout(timer);
      wraper();
    }
  }
  return {
    Debounce, Clear,
  };
}
