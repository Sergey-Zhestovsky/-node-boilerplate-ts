export interface IBaseClientErrorType {
  status: number;
  message: string;
}

export interface ICustomClientErrorType {
  status: number;
  message?: string;
}

interface ITypedClientErrorType {
  type: string;
}

export interface IBaseClientErrorObj extends ITypedClientErrorType, IBaseClientErrorType {}

export interface ICustomClientErrorObj extends ITypedClientErrorType, ICustomClientErrorType {}

export interface IClientError<T = unknown> extends Partial<IBaseClientErrorObj> {
  descriptor?: T;
}

export interface ITypedClientError<T = unknown> extends Omit<IClientError<T>, 'type'> {}

export interface IStatusedClientError<T = unknown> extends Omit<IClientError<T>, 'status'> {}

export interface IPublicError<T = unknown> {
  type: string;
  status: number;
  message: string | null;
  descriptor?: T;
  date: string;
}
