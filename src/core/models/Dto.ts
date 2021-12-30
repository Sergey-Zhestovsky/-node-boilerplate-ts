import Joi from 'joi';

export class Dto {
  static validator(JoiSchema: Joi.Root): Joi.SchemaMap | string[] {
    return {};
  }

  constructor(...args: any[]) {}
}

export class QueryDto extends Dto {}

export class BodyDto extends Dto {}
