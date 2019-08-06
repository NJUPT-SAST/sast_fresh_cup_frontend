export default function Throttle(interval) {
  let timer;
  return function schedule(fn) {
    timer = setTimeout(fn, interval);
    return function abolish() {
      clearTimeout(timer);
    };
  };
}
