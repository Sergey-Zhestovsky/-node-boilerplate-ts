import Joi from 'joi';

export class Dto {
  static validator(JoiSchema: Joi.Root): Joi.SchemaMap | string[] {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(...args: any[]) {}
}

export class QueryDto extends Dto {}

export class BodyDto extends Dto {}
