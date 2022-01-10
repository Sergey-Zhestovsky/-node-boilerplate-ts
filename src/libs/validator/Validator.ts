import Joi, { ValidationOptions } from 'joi';

import { extensionFactory, IExtendedValidator } from './extensions';
import { IValidationResult, IValidatorConfig, TSchemaContainer } from './types';

export class Validator {
  private schema: Joi.ObjectSchema | null;
  private config: ValidationOptions;
  public readonly joi: IExtendedValidator;

  constructor() {
    this.schema = null;
    this.config = this.getDefaultConfig();
    this.joi = Joi.extend(...extensionFactory);
  }

  private getDefaultConfig(): ValidationOptions {
    return {
      abortEarly: false,
      convert: true,
      presence: 'required',
      stripUnknown: true,
    };
  }

  setConfig(config: IValidatorConfig) {
    const { required = true, errors = {}, ...rest } = config;

    const validatorConfig: ValidationOptions = {
      presence: required ? 'required' : 'optional',
      errors: {
        wrap: { label: `'` },
        ...errors,
      },
      ...rest,
    };

    this.config = { ...this.config, ...validatorConfig };
  }

  setSchema(schema: TSchemaContainer, config?: IValidatorConfig) {
    if (config) this.setConfig(config);

    let retrievedSchema: string[] | Joi.SchemaMap;

    if (schema instanceof Function) {
      retrievedSchema = schema(this.joi);
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

  validate<T>(data: unknown, config?: IValidatorConfig): IValidationResult<T> | null {
    if (!this.schema) return null;
    if (config) this.setConfig(config);

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
