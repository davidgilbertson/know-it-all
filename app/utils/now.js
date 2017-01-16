export default function () {
  let now;

  if (`performance` in window) {
    now = performance.now();
  } else {
    now = 0;
  }
  return Math.round(now);
}
