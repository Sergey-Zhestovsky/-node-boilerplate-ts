import { RequestHandler } from '@/core/express';
import { Dto } from '@/core/models/Dto';
import { Validator, TSchemaContainer, IValidatorConfig, TTranslationModel } from '@/libs/validator';
import { ENamespace, localization } from '@/libs/localization';
import { Client400Error } from '@/libs/server-responses';
import { is } from '@/utils';

type TRequestProperty = 'body' | 'query' | 'params';

const validate = (requestProperty: TRequestProperty, errorMessage = (error: string) => error) => {
  const validatorMiddleware = (
    schema: TSchemaContainer | typeof Dto,
    validationConfig?: IValidatorConfig,
    replaceContent?: boolean
  ) => {
    const validator = new Validator();
    const isDto = is.extendsOf(Dto, schema);
    validator.setSchema(isDto ? schema.validator : schema, validationConfig);

    void localization.awaitInit().then(() => {
      validator.setTranslations(
        localization.getAllNamespaceTranslations(ENamespace.ValidationErrors) as TTranslationModel,
        localization.mainLanguage
      );
    });

    const requestHandler: RequestHandler = (req, res, next) => {
      const validationResult = validator.validate(req[requestProperty], {
        language: req.session.connection.language,
      });

      if (validationResult.errors) {
        return next(
          new Client400Error({
            message: errorMessage(validationResult.errorMessage ?? ''),
            descriptor: validationResult.errors,
          })
        );
      }

      if (isDto && replaceContent === undefined) {
        const DtoSchema = schema;
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
