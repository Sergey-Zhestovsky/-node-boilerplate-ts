import { BaseEvent } from './BaseEvent';

export type TListener<T> = (payload: T) => void | Promise<void>;

export interface IBusEvent<T extends BaseEvent = BaseEvent> {
  new (...args: any[]): T;
  get EventName(): string;
}
