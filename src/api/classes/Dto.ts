import Joi from 'joi';

export abstract class Dto {
  static validator(JoiSchema: Joi.Root): Joi.SchemaMap | string[] {
    return {};
  }
}

export abstract class QueryDto extends Dto {}

export abstract class BodyDto extends Dto {}

export default Dto;
