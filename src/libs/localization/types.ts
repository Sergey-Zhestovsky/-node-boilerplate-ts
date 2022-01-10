import { InitOptions } from 'i18next';
import { i18nextFsBackend } from 'i18next-fs-backend';

export enum ENamespace {
  Common = 'common',
  ErrorMessages = 'errorMessages',
  ValidationErrors = 'validationErrors',
}

export interface IOptions {
  baseLanguage: string;
  baseNamespace: string;
  localizationRootPath: string;
  foldernameForMissingKeys: string;
  normalizeNamespaceNames: boolean;

  preferredLangRequestHeader?: string;
}

export interface IGeneratedOptions {
  languages: string[];
  namespaces: string[];
}

export interface IBackendOptions extends i18nextFsBackend.i18nextFsBackendOptions {
  normalizeNamespaceFilenames?: boolean;
}

export interface IInitOptions extends InitOptions {
  backend: IBackendOptions;
}
