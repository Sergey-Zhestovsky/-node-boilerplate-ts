import { localization } from '@/libs/localization';

export const clientErrors = {
  ExpiredToken: {
    status: 401,
    message: localization.strings.errorMessages.accessToken,
  },
};
