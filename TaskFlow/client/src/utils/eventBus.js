
const eventTarget = new EventTarget();

export const eventBus = {
  emit: (type, detail) => eventTarget.dispatchEvent(new CustomEvent(type, { detail })),
  on: (type, callback) => eventTarget.addEventListener(type, callback),
  off: (type, callback) => eventTarget.removeEventListener(type, callback),
};
