import Joi, { Root, ValidationOptions, SchemaMap } from 'joi';

import validationErrorMessages from '../data/validation-errors.json';

export interface IValidatorConfig extends ValidationOptions {
  required?: boolean;
}

export type TSchemaContainer = ((joi: Root) => SchemaMap | string[]) | string[];

export interface IValidationResult<T = unknown> {
  value: T;
  errors: Record<string, string> | null;
  errorMessage: string | null;
}

class Validator {
  private schema: Joi.ObjectSchema | null;
  private config: ValidationOptions;

  constructor() {
    this.schema = null;
    this.config = this.getDefaultConfig();
  }

  getDefaultConfig(): ValidationOptions {
    return {
      abortEarly: false,
      convert: true,
      presence: 'required',
      allowUnknown: true,
    };
  }

  setConfig(config: IValidatorConfig) {
    const { required = true, messages = {}, errors = {}, ...rest } = config;

    const validatorConfig: ValidationOptions = {
      presence: required ? 'required' : 'optional',
      messages: { ...validationErrorMessages, ...messages },
      errors: {
        wrap: { label: `'` },
        ...errors,
      },
      ...rest,
    };

    this.config = { ...this.config, ...validatorConfig };
  }

  setSchema(schema: TSchemaContainer, config: IValidatorConfig = this.getDefaultConfig()) {
    this.setConfig(config);

    let retrievedSchema: string[] | Joi.SchemaMap;

    if (schema instanceof Function) {
      retrievedSchema = schema(Joi);
    } else {
      retrievedSchema = schema;
    }

    if (Array.isArray(retrievedSchema)) {
      const validationSchema: Joi.SchemaMap = {};
      retrievedSchema.forEach((setting) => (validationSchema[setting] = Joi.any()));
      this.schema = Joi.object(validationSchema);
    } else if (typeof retrievedSchema === 'object') {
      this.schema = Joi.object(retrievedSchema);
    }

    return this;
  }

  validate<T>(data: unknown): IValidationResult<T> | null {
    if (!this.schema) return null;

    const result = this.schema.validate(data, this.config);
    let errors: Record<string, string> | null = null;
    let errorMessage: string | null = null;

    if (result.error) {
      errors = {};

      errorMessage = result.error.details
        .map((detail) => {
          if (detail.context?.key && errors) {
            errors[detail.context.key] = detail.message;
          }

          return detail.message;
        })
        .join(' | ');
    }

    return {
      value: errors ? null : result.value ?? null,
      errors: errors,
      errorMessage: errorMessage,
    };
  }
}

export default Validator;
