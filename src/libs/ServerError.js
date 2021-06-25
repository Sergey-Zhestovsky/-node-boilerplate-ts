const { v4: uuid } = require('uuid');

const { ClientError } = require('./ClientError');

class ServerError extends ClientError {
  static create(error) {
    if (error instanceof ServerError) {
      return error;
    } else if (error instanceof Error) {
      return new ServerError(error);
    } else if (error instanceof String) {
      const errorObj = { name: error, message: error };
      Error.captureStackTrace(errorObj);
      return new ServerError(errorObj);
    } else if (error instanceof Object) {
      Error.captureStackTrace(error);
      return new ServerError(error);
    }

    const errorObj = {};
    Error.captureStackTrace(errorObj);
    return new ServerError(errorObj);
  }

  constructor(error) {
    super(error);

    this.stack = error.stack;
    this.correlationId = null;
  }

  async correlate() {
    if (this.correlationId !== null) return;
    this.correlationId = uuid();
    // TODO: create record in db.error table with error object and id as `correlationId`
    // await db.actions.error.add({ id: this.correlationId, ...this.getError(false) });
  }

  removeStack() {
    this.stack = null;
  }

  /** @protected */
  getRawError() {
    const { date, ...restErr } = super.getRawError();

    return {
      ...restErr,
      stack: this.stack,
      correlationId: this.correlationId,
      date,
    };
  }
}

module.exports = ServerError;
