import { v4 as uuid } from 'uuid';

import { ClientError } from './ClientError';

interface IServerErrorConstructor {
  name?: string;
  message?: string;
  stack?: string;
}

type TServerErrorVariant = ServerError | Error | Record<string, string> | string;

class ServerError extends ClientError {
  static create(error: TServerErrorVariant) {
    if (error instanceof ServerError) {
      return error;
    } else if (error instanceof Error) {
      return new ServerError(error);
    } else if (error instanceof Object) {
      Error.captureStackTrace(error);
      return new ServerError(error);
    } else if (typeof error === 'string') {
      const errorObj = { name: error, message: error };
      Error.captureStackTrace(errorObj);
      return new ServerError(errorObj);
    }

    const errorObj = {};
    Error.captureStackTrace(errorObj);
    return new ServerError(errorObj);
  }

  public stack?: string;
  private correlationId: string | null;

  constructor(error: IServerErrorConstructor) {
    super(error);

    this.stack = error.stack;
    this.correlationId = null;
  }

  async correlate() {
    if (this.correlationId !== null) return;
    this.correlationId = uuid();
    // TODO: create record in db.error table with error object and id as `correlationId`
    // try
    // await db.actions.error.add({ id: this.correlationId, ...this.getError(false) });
    // catch
  }

  removeStack() {
    this.stack = undefined;
  }

  protected getRawError() {
    const { date, ...restErr } = super.getRawError();

    return {
      ...restErr,
      stack: this.stack,
      correlationId: this.correlationId,
      date,
    };
  }
}

export default ServerError;
