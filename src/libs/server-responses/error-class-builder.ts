import { baseErrors } from './client-errors';
import { ClientError } from './ClientError';
import { ICustomClientErrorObj, IStatusedClientError, ITypedClientError } from './types';

export const baseClientErrorClassBuilder = (Class: typeof ClientError) => {
  return (defaultOptions: ICustomClientErrorObj) => {
    return class <Descriptor = unknown> extends Class<Descriptor> {
      constructor(paramsOrMessage?: IStatusedClientError<Descriptor> | string) {
        super(Class.construct(defaultOptions, paramsOrMessage));
      }
    };
  };
};

export const customClientErrorClassBuilder = (Class: typeof ClientError) => {
  return (defaultOptions: ICustomClientErrorObj) => {
    const baseErrorObj = Object.values(baseErrors).find((v) => v.status === defaultOptions.status);

    return class <Descriptor = unknown> extends Class<Descriptor> {
      constructor(paramsOrMessage?: ITypedClientError<Descriptor> | string) {
        super(Class.construct({ ...baseErrorObj, ...defaultOptions }, paramsOrMessage));
      }
    };
  };
};
