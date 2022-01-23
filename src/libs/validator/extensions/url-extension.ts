import Joi from 'joi';
import { URL } from 'url';

export interface IUrlStringExtend extends Joi.StringSchema {
  url(): this;
}

export const urlValidatorExtension: Joi.ExtensionFactory = (joi: Joi.Root) => {
  return {
    type: 'string',
    base: joi.string(),
    rules: {
      url: {
        method() {
          return this.$_addRule({ name: 'url' });
        },
        validate(value: string, helpers: Joi.CustomHelpers) {
          try {
            return new URL(value);
          } catch {
            return helpers.error('string.uri');
          }
        },
      },
    },
  };
};
