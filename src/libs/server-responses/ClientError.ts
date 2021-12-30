import { trimObject } from '@/utils';
import clientErrors from '@/data/client-errors.json';
import { EClientErrorType } from './client-error-type';

interface IBaseClientError {
  type: string;
  status: number;
  message: string;
}

interface IClientError<T = unknown> extends Partial<IBaseClientError> {
  descriptor?: T;
}

type TClientErrorVariant = ClientError | Error | Record<string, string> | string;

export interface IPublicError<T = unknown> {
  type: string;
  status: number;
  message?: string;
  descriptor?: T;
  date: string;
}

export class ClientError<Descriptor = unknown> extends Error {
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

  protected static construct<Descriptor = unknown>(
    originErrorObject: IClientError<Descriptor>,
    override?: IClientError<Descriptor> | string
  ) {
    let origin = { ...originErrorObject };

    if (typeof override === 'object') origin = { ...origin, ...override };
    else origin.message = override;

    return origin;
  }

  static get Type() {
    return EClientErrorType;
  }

  public readonly type: string;
  public readonly status: number;
  public readonly userMessage: string | null;
  public readonly descriptor: Descriptor | null;
  public readonly date: string;

  constructor({ type, status, message, descriptor }: IClientError<Descriptor>) {
    super(message);

    this.type = type ?? clientErrors.InternalServerError.type;
    this.status = status ?? clientErrors.InternalServerError.status;
    this.userMessage = message ?? null;
    this.descriptor = descriptor ?? null;
    this.date = new Date().toISOString();
  }

  protected getRawError() {
    return {
      type: this.type,
      status: this.status,
      message: this.userMessage,
      descriptor: this.descriptor,
      date: this.date,
    };
  }

  getError() {
    return trimObject(this.getRawError()) as IPublicError<Descriptor>;
  }
}

const buildErrorClass = (defaultOptions: IBaseClientError) => {
  return class <Descriptor = unknown> extends ClientError<Descriptor> {
    constructor(paramsOrMessage?: IClientError<Descriptor> | string) {
      super(ClientError.construct(defaultOptions, paramsOrMessage));
    }
  };
};

export const Client400Error = buildErrorClass(clientErrors.BadRequest);
export const Client401Error = buildErrorClass(clientErrors.Unauthorized);
export const Client403Error = buildErrorClass(clientErrors.Forbidden);
export const Client404Error = buildErrorClass(clientErrors.NotFound);
export const Client409Error = buildErrorClass(clientErrors.Conflict);
export const Client410Error = buildErrorClass(clientErrors.Gone);
export const Client429Error = buildErrorClass(clientErrors.TooManyRequests);
export const Client500Error = buildErrorClass(clientErrors.BadRequest);

export default ClientError;
