import { Localization } from '@/libs/localization';

export const clientErrors = {
  ExpiredToken: {
    status: 401,
    message: Localization.strings.errorMessages.accessToken,
  },
};
