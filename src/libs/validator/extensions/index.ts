import Joi from 'joi';

import {
  oneOfNumberValidatorExtension,
  oneOfStringValidatorExtension,
  IOneOfNumberExtend,
  IOneOfStringExtend,
} from './oneOf-extension';
import { urlValidatorExtension, IUrlStringExtend } from './url-extension';
import { passwordValidatorExtension, IPasswordValidator } from './password-extension';
import { phoneNumberValidatorExtension } from './phone-number-extension';

interface IStringScheme extends IUrlStringExtend, IOneOfStringExtend {}
interface INumberScheme extends IOneOfNumberExtend {}

export interface IExtendedValidator extends Joi.Root, IPasswordValidator {
  string(): IStringScheme;
  number(): INumberScheme;
}

export const extensionFactory = [
  oneOfNumberValidatorExtension,
  oneOfStringValidatorExtension,
  urlValidatorExtension,
  passwordValidatorExtension,
  phoneNumberValidatorExtension,
];
