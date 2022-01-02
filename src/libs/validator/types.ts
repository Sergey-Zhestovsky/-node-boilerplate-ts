import { ValidationOptions, SchemaMap } from 'joi';
import { IExtendedValidator } from './extensions';

export interface IValidatorConfig extends ValidationOptions {
  required?: boolean;
}

export type TSchemaContainer =
  | ((joi: IExtendedValidator) => SchemaMap | string[])
  | SchemaMap
  | string[];

export interface IValidationResult<T = unknown> {
  value: T;
  errors: Record<string, string> | null;
  errorMessage: string | null;
}

export { IExtendedValidator };
