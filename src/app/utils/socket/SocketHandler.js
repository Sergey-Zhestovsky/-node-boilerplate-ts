const Joi = require('joi');
const { Server, Socket } = require('socket.io');

const SocketEvent = require('./SocketEvent');

class SocketHandler {
  /**
   * @param {Server} server
   * @param {Socket} socket
   */
  constructor(server, socket) {
    this.server = server;
    this.socket = socket;
  }

  /** @returns {SocketEvent} */
  get Event() {
    return new SocketEvent();
  }

  /**
   * Method for handling incoming event.
   *
   * @param {any[]} args - event payload
   */
  handle(...args) {}

  /**
   * Method for validation user's payloads. Also, replace original values with
   * validated object. Return s validation schema for dto.
   *
   * @param {Joi} T
   * @returns {null | Joi.Schema | (Joi.Schema | null)[]} - `null`: without validation,
   *   `Joi.Schema`: for validation first arg, array of `Joi.Schema | null`: for
   *   validation all arguments taken by `handle` function.
   */
  validator(T) {
    return null;
  }

  /**
   * Method for validating request before it gets to handle method.
   *
   * @param {any[]} args - event payload
   * @returns {boolean}
   */
  guard(...args) {
    return true;
  }
}

module.exports = SocketHandler;
