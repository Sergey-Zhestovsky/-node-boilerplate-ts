import Joi from 'joi';
import { Server, Socket } from 'socket.io';

import SocketEvent from './SocketEvent';

class SocketHandler<T extends unknown[] = unknown[]> {
  protected readonly server: Server;
  protected readonly socket: Socket;

  constructor(server: Server, socket: Socket) {
    this.server = server;
    this.socket = socket;
  }

  get Event(): SocketEvent {
    return new SocketEvent();
  }

  /**
   * Method for handling incoming event.
   */
  handle(...args: T): Promise<void> | void {}

  /**
   * Method for validation user's payloads. Also, replace original values with
   * validated object. Return s validation schema for dto.
   *
   * @returns `null`: without validation,
   *   `Joi.Schema`: for validation first arg, array of `Joi.Schema | null`: for
   *   validation all arguments taken by `handle` function.
   */
  validator(JoiSchema: Joi.Root): Array<Joi.SchemaMap | null> | Joi.SchemaMap | null {
    return null;
  }

  /**
   * Method for validating request before it gets to handle method.
   */
  guard(...args: T): boolean {
    return true;
  }
}

export default SocketHandler;
