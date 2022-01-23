import EventEmitter from 'events';

import { HealthManager } from '../health-manager';
import { BaseEvent } from './BaseEvent';
import { IBusEvent, TListener } from './types';

export class EventBus {
  private static getEventName(eventClass: IBusEvent | string) {
    return typeof eventClass === 'function' ? eventClass.EventName : eventClass;
  }

  private readonly eventEmitter = new EventEmitter();

  on<T extends BaseEvent>(event: MaybeArray<IBusEvent<T> | string>, listener: TListener<T>) {
    const events = Array.isArray(event) ? event : [event];

    for (const e of events) {
      this.eventEmitter.on(EventBus.getEventName(e), listener);
    }
  }

  one<T extends BaseEvent>(event: MaybeArray<IBusEvent<T> | string>, listener: TListener<T>) {
    const events = Array.isArray(event) ? event : [event];

    for (const e of events) {
      this.eventEmitter.once(EventBus.getEventName(e), listener);
    }
  }

  off<T extends BaseEvent>(event: MaybeArray<IBusEvent<T> | string>, listener: TListener<T>) {
    const events = Array.isArray(event) ? event : [event];

    for (const e of events) {
      this.eventEmitter.off(EventBus.getEventName(e), listener);
    }
  }

  emit(event: BaseEvent) {
    Promise.resolve()
      .then(() => {
        const eventName = event.EventName;
        this.eventEmitter.emit(eventName, event);
      })
      .catch((error) => {
        HealthManager.report(error);
      });
  }
}
