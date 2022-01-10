import { localization } from '@/libs/localization';

export const BASE_ERRORS = {
  BadRequest: {
    status: 400,
    message: localization.strings.errorMessages.badRequest,
  },
  Unauthorized: {
    status: 401,
    message: localization.strings.errorMessages.unauthorized,
  },
  Forbidden: {
    status: 403,
    message: localization.strings.errorMessages.forbidden,
  },
  NotFound: {
    status: 404,
    message: localization.strings.errorMessages.notFound,
  },
  Conflict: {
    status: 409,
    message: localization.strings.errorMessages.conflict,
  },
  Gone: {
    status: 410,
    message: localization.strings.errorMessages.gone,
  },
  TooManyRequests: {
    status: 429,
    message: localization.strings.errorMessages.tooManyRequests,
  },
  InternalServerError: {
    status: 500,
    message: localization.strings.errorMessages.internalServerError,
  },
};
