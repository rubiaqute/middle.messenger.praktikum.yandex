type EventBusCallBack = (...args: unknown[]) => unknown

export class EventBus {
  listeners: Record<string, EventBusCallBack[]>;

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: EventBusCallBack) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: EventBusCallBack) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback,
    );
  }

  emit(event: string, ...args: unknown[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(function (listener) {
        listener(...args);
      });
    }
  }
}
