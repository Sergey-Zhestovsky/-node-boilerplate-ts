import { BaseEvent } from '../BaseEvent';

export class TestEvent extends BaseEvent {
  static get EventName() {
    return 'new-user-event';
  }

  constructor(public val: string) {
    super(TestEvent);
  }
}
