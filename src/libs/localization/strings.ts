import { ENamespace } from './types';

import commonStrings from '@/data/localization/en/common.json';
import errorMessageStrings from '@/data/localization/en/error-messages.json';
import validationErrorStrings from '@/data/localization/en/validation-errors.json';

export const strings = {
  [ENamespace.Common]: commonStrings,
  [ENamespace.ErrorMessages]: errorMessageStrings,
  [ENamespace.ValidationErrors]: validationErrorStrings,
};
