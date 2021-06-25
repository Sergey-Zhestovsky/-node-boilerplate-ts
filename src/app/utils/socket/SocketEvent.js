const Room = require('./Room');

class SocketEvent {
  /** @returns {string} */
  static get Name() {
    return new this().Name;
  }

  /** @returns {string} */
  static getName() {
    return new this().Name;
  }

  /** @returns {string} */
  get Name() {
    return 'socket-event';
  }

  /** @returns {string} */
  getName() {
    return this.Name;
  }

  /** @returns {Room | null} */
  static get Room() {
    return new this().Room;
  }

  /** @returns {Room | null} */
  static getRoom() {
    return new this().Room;
  }

  /** @returns {Room | null} */
  get Room() {
    return null;
  }

  /** @returns {Room | null} */
  getRoom() {
    return this.Room;
  }

  /** @returns {string} */
  toString() {
    return this.Name;
  }

  /** @returns {string} */
  valueOf() {
    return this.Name;
  }
}

module.exports = SocketEvent;
