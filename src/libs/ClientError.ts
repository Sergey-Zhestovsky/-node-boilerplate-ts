import trimObject from '../utils/trim-object';
import clientErrors from '../data/client-errors.json';

interface IClientErrorConstructor {
  code?: string;
  type?: string;
  status?: number;
  message?: string;
  description?: unknown;
}

interface IClientErrorDataModel {
  code: string;
  type: string;
  status: number;
  message: string;
}

interface IClientErrorConstructorModel extends Partial<IClientErrorDataModel> {
  description?: object | string;
}

type TClientErrorVariant = ClientError | Error | Record<string, string> | string;

export class ClientError extends Error {
  static create(error: TClientErrorVariant, description?: string) {
    if (error instanceof ClientError) {
      return error;
    } else if (error instanceof Error) {
      return new ClientError({ message: description ?? error.message });
    } else if (error instanceof Object) {
      return new ClientError({ ...error, message: description ?? error.message });
    } else if (typeof error === 'string') {
      return new ClientError({ message: description ?? error });
    }

    return new ClientError({ message: description });
  }

  static construct(
    originErrorObject: IClientErrorConstructorModel,
    override?: IClientErrorConstructorModel | string
  ) {
    let origin = { ...originErrorObject };
    if (typeof override === 'object') origin = { ...origin, ...override };
    else if (typeof override === 'string') origin.message = override;
    return origin;
  }

  static get Errors(): Record<string, IClientErrorDataModel> {
    return clientErrors;
  }

  public readonly code: string;
  public readonly type: string;
  public readonly status: number;
  public readonly userMessage: string | null;
  public readonly description: unknown | null;
  public readonly date: string;

  constructor({ code, type, status, message, description }: IClientErrorConstructor) {
    super(message);

    this.code = code ?? ClientError.Errors.InternalServerError.code;
    this.type = type ?? ClientError.Errors.InternalServerError.type;
    this.status = status ?? ClientError.Errors.InternalServerError.status;
    this.userMessage = message ?? null;
    this.description = description ?? null;
    this.date = new Date().toISOString();
  }

  protected getRawError() {
    return {
      code: this.code,
      type: this.type,
      status: this.status,
      message: this.userMessage,
      description: this.description,
      date: this.date,
    };
  }

  getError() {
    return trimObject(this.getRawError());
  }
}

export class Client400Error extends ClientError {
  constructor(message?: IClientErrorConstructorModel | string) {
    super(ClientError.construct(ClientError.Errors.ValidationError, message));
  }
}

export class Client401Error extends ClientError {
  constructor(message?: IClientErrorConstructorModel | string) {
    super(ClientError.construct(ClientError.Errors.AuthorizationError, message));
  }
}

export class Client403Error extends ClientError {
  constructor(message?: IClientErrorConstructorModel | string) {
    super(ClientError.construct(ClientError.Errors.PrivilegeError, message));
  }
}

export class Client404Error extends ClientError {
  constructor(message?: IClientErrorConstructorModel | string) {
    super(ClientError.construct(ClientError.Errors.NotFound, message));
  }
}

export class Client500Error extends ClientError {
  constructor(message?: IClientErrorConstructorModel | string) {
    super(ClientError.construct(ClientError.Errors.InternalServerError, message));
  }
}

export default ClientError;
