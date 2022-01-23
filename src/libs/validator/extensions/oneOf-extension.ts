import Joi, { RuleArgs } from 'joi';

export interface IOneOfStringExtend extends Joi.StringSchema {
  oneOf(values: string[]): this;
}

export interface IOneOfNumberExtend extends Joi.NumberSchema {
  oneOf(values: number[]): this;
}

const nonEmptyArrayOf = (type: string) => {
  return (value: unknown) => {
    return Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === type);
  };
};

const commonExtension = <T extends string | number>(
  oneOfArgsValidator: Array<RuleArgs | string>
): Omit<Joi.Extension, 'type' | 'base'> => {
  return {
    messages: {
      'oneOf.base': '{{#label}} must be one of the values: {{#values}}',
    },
    rules: {
      oneOf: {
        method(values: T[]) {
          return this.$_addRule({
            name: 'oneOf',
            args: { values },
          });
        },
        args: oneOfArgsValidator,
        validate(value: T, helpers: Joi.CustomHelpers, { values }: { values: T[] }) {
          if (!values.includes(value)) {
            return helpers.error('oneOf.base', { values: `'${values.join(`', '`)}'` });
          }

          return value;
        },
      },
    },
  };
};

export const oneOfStringValidatorExtension: Joi.ExtensionFactory = (joi: Joi.Root) => {
  return {
    type: 'string',
    base: joi.string(),
    ...commonExtension([
      {
        name: 'values',
        assert: nonEmptyArrayOf('string'),
        message: 'must be a non empty array of strings',
      },
    ]),
  };
};

export const oneOfNumberValidatorExtension: Joi.ExtensionFactory = (joi: Joi.Root) => {
  return {
    type: 'number',
    base: joi.number(),
    ...commonExtension([
      {
        name: 'values',
        assert: nonEmptyArrayOf('number'),
        message: 'must be a non empty array of numbers',
      },
    ]),
  };
};
