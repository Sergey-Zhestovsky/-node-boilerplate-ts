import { localization } from '../localization';
import { trimObject } from '@/utils';
import { EClientErrorType, baseErrors, clientErrors } from './client-errors';
import { baseClientErrorClassBuilder, customClientErrorClassBuilder } from './error-class-builder';
import { IClientError, IPublicError } from './types';

type TClientErrorVariant = ClientError | Error | Record<string, string> | string;

type TCustomClientErrorClass = ReturnType<ReturnType<typeof customClientErrorClassBuilder>>;

export class ClientError<Descriptor = unknown> extends Error {
  private static customClientErrors: Record<keyof typeof clientErrors, TCustomClientErrorClass>;

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
    else if (typeof override === 'string') origin.message = override;

    return origin;
  }

  static get Type() {
    return EClientErrorType;
  }

  static get from() {
    return this.customClientErrors;
  }

  public readonly type: string;
  public readonly status: number;
  public readonly userMessage: string | null;
  public readonly descriptor?: Descriptor;
  public readonly date: string;

  constructor({ type, status, message, descriptor }: IClientError<Descriptor>) {
    super(message);

    this.type = type ?? baseErrors.InternalServerError.type;
    this.status = status ?? baseErrors.InternalServerError.status;
    this.userMessage = message ?? null;
    this.descriptor = descriptor;
    this.date = new Date().toISOString();
  }

  static {
    const buildErrorClass = customClientErrorClassBuilder(this);

    this.customClientErrors = Object.fromEntries(
      Object.entries(clientErrors).map(([key, clientError]) => [key, buildErrorClass(clientError)])
    ) as Record<keyof typeof clientErrors, TCustomClientErrorClass>;
  }

  protected getRawError(): IPublicError {
    return {
      type: this.type,
      status: this.status,
      message: this.userMessage,
      descriptor: this.descriptor,
      date: this.date,
    };
  }

  getError(localizeMessageLng?: string) {
    const rawError = this.getRawError();

    if (localizeMessageLng && rawError.message) {
      rawError.message = localization.translateStr(rawError.message, localizeMessageLng);
    }

    return trimObject(rawError);
  }
}

const buildErrorClass = baseClientErrorClassBuilder(ClientError);

export const Client400Error = buildErrorClass(baseErrors.BadRequest);
export const Client401Error = buildErrorClass(baseErrors.Unauthorized);
export const Client403Error = buildErrorClass(baseErrors.Forbidden);
export const Client404Error = buildErrorClass(baseErrors.NotFound);
export const Client409Error = buildErrorClass(baseErrors.Conflict);
export const Client410Error = buildErrorClass(baseErrors.Gone);
export const Client429Error = buildErrorClass(baseErrors.TooManyRequests);
export const Client500Error = buildErrorClass(baseErrors.BadRequest);

export default ClientError;
