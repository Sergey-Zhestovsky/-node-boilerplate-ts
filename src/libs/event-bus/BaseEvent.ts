type TBaseEventClass = abstract new (...any: any[]) => BaseEvent;

export abstract class BaseEvent {
  static get EventName(): string {
    throw new Error(`Forgot to set 'static get EventName()' for ${this.name} event class`);
  }

  protected readonly class: typeof BaseEvent;

  constructor(childClass: TBaseEventClass) {
    this.class = childClass as typeof BaseEvent;
  }

  get EventName(): string {
    return this.class.EventName;
  }
}
