function addEvent(el, eventName, func) {
  if (typeof window === `undefined`) return;

  el.addEventListener(eventName, func);
}

export default addEvent;
