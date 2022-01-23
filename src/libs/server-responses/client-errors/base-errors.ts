import { Localization } from '@/libs/localization';

export const BASE_ERRORS = {
  BadRequest: {
    status: 400,
    message: Localization.strings.errorMessages.badRequest,
  },
  Unauthorized: {
    status: 401,
    message: Localization.strings.errorMessages.unauthorized,
  },
  Forbidden: {
    status: 403,
    message: Localization.strings.errorMessages.forbidden,
  },
  NotFound: {
    status: 404,
    message: Localization.strings.errorMessages.notFound,
  },
  Conflict: {
    status: 409,
    message: Localization.strings.errorMessages.conflict,
  },
  Gone: {
    status: 410,
    message: Localization.strings.errorMessages.gone,
  },
  TooManyRequests: {
    status: 429,
    message: Localization.strings.errorMessages.tooManyRequests,
  },
  InternalServerError: {
    status: 500,
    message: Localization.strings.errorMessages.internalServerError,
  },
};
