import EventEmitter from 'events';

import { BaseEvent } from './BaseEvent';
import { IBusEvent, TListener } from './types';

class EventBus {
  private readonly eventEmitter = new EventEmitter();

  on<T extends BaseEvent>(eventClass: IBusEvent<T> | string, listener: TListener<T>) {
    const eventName = typeof eventClass === 'function' ? eventClass.EventName : eventClass;
    this.eventEmitter.on(eventName, listener);
  }

  one<T extends BaseEvent>(eventClass: IBusEvent<T> | string, listener: TListener<T>) {
    const eventName = typeof eventClass === 'function' ? eventClass.EventName : eventClass;
    this.eventEmitter.once(eventName, listener);
  }

  off<T extends BaseEvent>(eventClass: IBusEvent<T> | string, listener: TListener<T>) {
    const eventName = typeof eventClass === 'function' ? eventClass.EventName : eventClass;
    this.eventEmitter.off(eventName, listener);
  }

  emit(event: BaseEvent) {
    const eventName = event.EventName;
    this.eventEmitter.emit(eventName, event);
  }
}

export const eventBus = new EventBus();
