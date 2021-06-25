const Joi = require('joi');

const validationErrorMessages = require('../data/validation-errors.json');

class Validator {
  constructor() {
    this.schema = null;
    this.config = this.getDefaultConfig();
  }

  /**
   * @returns {Joi.ValidationOptions}
   */
  getDefaultConfig() {
    return {
      abortEarly: false,
      convert: true,
      presence: 'required',
      allowUnknown: true,
    };
  }

  /**
   * @param {Joi.ValidationOptions} config
   */
  setConfig(config) {
    const { required = true, messages = {}, errors = {}, ...rest } = config;

    const validatorConfig = {
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

  /**
   * @param {(joi: Joi) => Joi.SchemaMap | string[]} schema
   * @param {Joi.ValidationOptions} validationConfig
   */
  setSchema(schema, config = this.getDefaultConfig()) {
    this.setConfig(config);

    let retrievedSchema = null;

    if (schema instanceof Function) {
      retrievedSchema = schema(Joi);
    } else {
      retrievedSchema = schema;
    }

    if (Array.isArray(retrievedSchema)) {
      const validationSchema = {};
      retrievedSchema.forEach((setting) => (validationSchema[setting] = Joi.any()));
      this.schema = Joi.object(validationSchema);
    } else if (typeof retrievedSchema === 'object') {
      this.schema = Joi.object(retrievedSchema);
    }

    return this;
  }

  validate(data) {
    let result = null;
    let errors = null;
    let errorMessage = null;

    if (this.schema) {
      result = this.schema.validate(data, this.config);
    }

    if (result.error) {
      errors = {};
      errorMessage = result.error.details
        .map((detail) => {
          errors[detail.context.key] = detail.message;
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

module.exports = Validator;
