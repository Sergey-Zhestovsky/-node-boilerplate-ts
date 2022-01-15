import { RequestHandler } from 'express';

import { Dto } from '@/core/models/Dto';
import { Validator, TSchemaContainer, IValidatorConfig, TTranslationModel } from '@/libs/validator';
import { ENamespace, localization } from '@/libs/localization';
import { Client400Error } from '@/libs/server-responses';
import { classOf } from '@/utils';

type TRequestProperty = 'body' | 'query' | 'params';

const validate = (requestProperty: TRequestProperty, errorMessage = (error: string) => error) => {
  const validatorMiddleware = (
    schema: TSchemaContainer | typeof Dto,
    validationConfig?: IValidatorConfig,
    replaceContent?: boolean
  ) => {
    const validator = new Validator();
    const isDto = classOf(schema as typeof Dto, Dto);

    validator.setSchema(
      isDto ? (schema as typeof Dto).validator : (schema as TSchemaContainer),
      validationConfig
    );

    void localization.awaitInit().then(() => {
      validator.setTranslations(
        localization.getAllNamespaceTranslations(ENamespace.ValidationErrors) as TTranslationModel,
        localization.mainLanguage
      );
    });

    const requestHandler: RequestHandler<unknown, unknown, unknown, unknown> = (req, res, next) => {
      const validationResult = validator.validate(req[requestProperty], {
        language: req.session.connection.language,
      });

      if (validationResult === null) {
        return next();
      }

      if (validationResult.errors) {
        return next(
          new Client400Error({
            message: errorMessage(validationResult.errorMessage ?? ''),
            descriptor: validationResult.errors,
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
