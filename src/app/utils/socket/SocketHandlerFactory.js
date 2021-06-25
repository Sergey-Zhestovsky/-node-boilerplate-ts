const Joi = require('joi');
const { Server, Socket } = require('socket.io');

const Validator = require('../../../libs/Validator');
const { Client400Error } = require('../../../libs/ClientError');
const SocketHandler = require('./SocketHandler');

class SocketHandlerFactory {
  /**
   * @param {Server} server
   * @param {typeof SocketHandler[]} handlers
   */
  constructor(server, handlers = []) {
    this.server = server;
    this.handlers = handlers;
  }

  /** @param {typeof SocketHandler} handler */
  appendHandler(handler) {
    this.handlers.push(handler);
  }

  /** @param {Socket} socket */
  inject(socket) {
    this.handlers.forEach((Handler) => {
      const handler = new Handler(this.server, socket);

      const handleFn = (...args) => {
        if (!handler.guard(...args)) return;
        const validatedPayloads = SocketHandlerFactory.validatePayloads(handler, args);
        handler.handle(...validatedPayloads);
      };

      socket.on(handler.Event, handleFn);
    });
  }

  /**
   * @param {SocketHandler} handler
   * @param {any[]} payloads
   * @returns {any[]} - validated payloads
   * @throws {Client400Error}
   */
  static validatePayloads(handler, payloads) {
    const validationSchema = handler.validator(Joi);
    if (validationSchema === null) return payloads;
    const validator = new Validator();
    const result = [];

    if (Array.isArray(validationSchema)) {
      validationSchema.forEach((schema, i) => {
        if (schema) {
          validator.setSchema(schema);
          const { value, error } = validator.validate(payloads[i]);
          if (error) throw new Client400Error(`Bad payload: ${error}`);
          result[i] = value;
        } else {
          result[i] = payloads[i];
        }
      });
    } else {
      validator.setSchema(validationSchema);
      const { value, error } = validator.validate(payloads[0]);
      if (error) throw new Client400Error(`Bad payload: ${error}`);
      result[0] = value;
    }

    return result;
  }
}

module.exports = SocketHandlerFactory;
