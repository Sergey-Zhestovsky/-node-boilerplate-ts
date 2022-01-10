import path from 'path';

import { IOptions } from '@/libs/localization';

const config: IOptions = {
  baseLanguage: 'en',
  baseNamespace: 'common',
  localizationRootPath: path.resolve(__dirname, '../data/localization'),
  foldernameForMissingKeys: 'missing',
  normalizeNamespaceNames: true,

  preferredLangRequestHeader: 'x-preferred-lang',
};

export default config;
