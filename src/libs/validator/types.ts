import { ValidationOptions, SchemaMap } from 'joi';
import { IExtendedValidator } from './extensions';

export interface IValidatorConfig extends ValidationOptions {
  required?: boolean;
  language?: string;
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

export type TTranslationModel = Record<string, Record<string, string>>;

export { IExtendedValidator } from './extensions';
