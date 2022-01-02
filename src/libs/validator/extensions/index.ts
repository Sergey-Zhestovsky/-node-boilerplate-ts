import Joi from 'joi';

import { urlValidatorExtension, IUrlStringExtend } from './url-extension';
import { passwordValidatorExtension, IPasswordValidator } from './password-extension';
import { phoneNumberValidatorExtension } from './phone-number-extension';

interface IStringScheme extends IUrlStringExtend {}

export interface IExtendedValidator extends Joi.Root, IPasswordValidator {
  string(): IStringScheme;
}

export const extensionFactory = [
  urlValidatorExtension,
  passwordValidatorExtension,
  phoneNumberValidatorExtension,
];
