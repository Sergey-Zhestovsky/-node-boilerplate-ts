import { BASE_ERRORS } from './base-errors';
import { clientErrors as rowClientErrors } from './client-errors';
import { ICustomClientErrorObj, ICustomClientErrorType, IBaseClientErrorObj } from '../types';

const extendErrorTypeObject = <T extends Record<string, ICustomClientErrorType>>(errorTypes: T) => {
  return Object.fromEntries(
    Object.entries(errorTypes).map(([key, value]) => [key, { ...value, type: key }])
  ) as Record<keyof T, ICustomClientErrorObj>;
};

export const baseErrors = extendErrorTypeObject(BASE_ERRORS) as Record<
  keyof typeof BASE_ERRORS,
  IBaseClientErrorObj
>;

export const clientErrors = extendErrorTypeObject({
  ...BASE_ERRORS,
  ...rowClientErrors,
});

type TClientErrorType = keyof typeof rowClientErrors;
type TEnumClientErrorType = { [k in TClientErrorType]: k };

export const EClientErrorType = Object.fromEntries(
  Object.entries(rowClientErrors).map(([key]) => [key, key])
) as TEnumClientErrorType;
