import Joi from 'joi';
import { Server, Socket } from 'socket.io';

import Validator from '../../../libs/Validator';
import { Client400Error, Client500Error } from '../../../libs/ClientError';
import SocketHandler from './SocketHandler';

class SocketHandlerFactory {
  /**
   * @throws {Client500Error}
   * @throws {Client400Error}
   */
  static validatePayloads(handler: SocketHandler, payloads: unknown[]): unknown[] {
    const validationSchema = handler.validator(Joi);
    if (validationSchema === null) return payloads;
    const validator = new Validator();
    const result: unknown[] = [];

    if (Array.isArray(validationSchema)) {
      validationSchema.forEach((schema, i) => {
        if (schema) {
          validator.setSchema(schema);
          const vRes = validator.validate(payloads[i]);
          if (vRes === null) throw new Client500Error();
          if (vRes.errors) throw new Client400Error(`Bad payload: ${vRes.errorMessage ?? ''}`);
          result[i] = vRes.value;
        } else {
          result[i] = payloads[i];
        }
      });
    } else {
      validator.setSchema(validationSchema);
      const vRes = validator.validate(payloads[0]);
      if (vRes === null) throw new Client500Error();
      if (vRes.errors) throw new Client400Error(`Bad payload: ${vRes.errorMessage ?? ''}`);
      result[0] = vRes.value;
    }

    return result;
  }

  private readonly server: Server;
  private readonly handlers: Array<typeof SocketHandler>;

  constructor(server: Server, handlers: Array<typeof SocketHandler> = []) {
    this.server = server;
    this.handlers = handlers;
  }

  appendHandler(handler: typeof SocketHandler) {
    this.handlers.push(handler);
  }

  inject(socket: Socket) {
    this.handlers.forEach((Handler) => {
      const handler = new Handler(this.server, socket);

      const handleFn = (...args: unknown[]) => {
        if (!handler.guard(...args)) return;
        const validatedPayloads = SocketHandlerFactory.validatePayloads(handler, args);
        void handler.handle(...validatedPayloads);
      };

      socket.on(handler.Event.Name, handleFn);
    });
  }
}

module.exports = SocketHandlerFactory;
