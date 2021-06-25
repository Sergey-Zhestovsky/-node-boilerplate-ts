const trimObject = require('../utils/trim-object');
const clientErrors = require('../data/client-errors.json');

class ClientError extends Error {
  static create(error, description) {
    if (error instanceof ClientError) {
      return error;
    } else if (error instanceof Error) {
      return new ClientError({ title: error.name, message: description || error.message });
    } else if (error instanceof String) {
      return new ClientError({ name: error, message: description || error });
    } else if (error instanceof Object) {
      return new ClientError({ ...error, message: description || error.message });
    }

    return new ClientError({ message: description });
  }

  static construct(originErrorObject, override) {
    let origin = { ...originErrorObject };
    if (typeof override === 'object') origin = { ...origin, ...override };
    else if (typeof override === 'string') origin.message = override;
    return origin;
  }

  static get Errors() {
    return clientErrors;
  }

  constructor({ code, type, status, title, message, description }) {
    super(title);

    this.code = code ?? ClientError.Errors.InternalServerError.code;
    this.type = type ?? ClientError.Errors.InternalServerError.type;
    this.status = status ?? ClientError.Errors.InternalServerError.status;
    this.message = message ?? null;
    this.description = description ?? null;
    this.date = new Date().toISOString();
  }

  /** @protected */
  getRawError() {
    return {
      code: this.code,
      type: this.type,
      status: this.status,
      message: this.message,
      description: this.description,
      date: this.date,
    };
  }

  getError() {
    return trimObject(this.getRawError());
  }
}

class Client400Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.ValidationError, message));
  }
}

class Client401Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.AuthorizationError, message));
  }
}

class Client403Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.PrivilegeError, message));
  }
}

class Client404Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.NotFound, message));
  }
}

class Client500Error extends ClientError {
  constructor(message) {
    super(ClientError.construct(ClientError.Errors.InternalServerError, message));
  }
}

module.exports = {
  ClientError,
  Client400Error,
  Client401Error,
  Client403Error,
  Client404Error,
  Client500Error,
};
