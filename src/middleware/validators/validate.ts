import Joi from 'joi';
import { RequestHandler } from 'express';

import { Dto } from '../../api/classes/Dto';
import Validator, { TSchemaContainer } from '../../libs/Validator';
import { Client400Error } from '../../libs/ClientError';
import classOf from '../../utils/class-of';

type TRequestProperty = 'body' | 'query' | 'params';

const validate = (requestProperty: TRequestProperty, errorMessage = (error: string) => error) => {
  const validatorMiddleware = (
    schema: TSchemaContainer | typeof Dto,
    validationConfig?: Joi.ValidationOptions,
    replaceContent?: boolean
  ) => {
    const validator = new Validator();
    const isDto = classOf(schema as typeof Dto, Dto, {});

    validator.setSchema(
      isDto ? (schema as typeof Dto).validator : (schema as TSchemaContainer),
      validationConfig
    );

    const requestHandler: RequestHandler<unknown, unknown, unknown, unknown> = (req, res, next) => {
      const validationResult = validator.validate(req[requestProperty]);

      if (validationResult === null) {
        return next();
      }

      if (validationResult.errors) {
        return next(
          new Client400Error({
            message: errorMessage(validationResult.errorMessage ?? ''),
            description: validationResult.errors,
          })
        );
      }

      if (isDto && replaceContent === undefined) {
        const DtoSchema = schema as typeof Dto;
        req[requestProperty] = new DtoSchema(validationResult.value);
      } else if (replaceContent) {
        req[requestProperty] = validationResult.value;
      }

      return next();
    };

    return requestHandler;
  };

  return validatorMiddleware;
};

export const validateBody = validate('body', (error) => `Bad body: ${error}`);
export const validateQuery = validate('query', (error) => `Bad query: ${error}`);
