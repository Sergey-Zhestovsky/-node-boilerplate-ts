import { Request } from 'express';
import Negotiator from 'negotiator';

import { Localization } from '@/libs/localization';
import { Config } from '@/libs/config';

export interface INegotiationResult {
  negotiate: Negotiator;
  language: string;
}

const lookupLanguage = (request: Request, negotiator: Negotiator) => {
  let language: string | undefined;

  const headerName = Config.global.localization.preferredLangRequestHeader;

  if (headerName) {
    const langFromHeader = request.headers[headerName];
    if (langFromHeader) language = Localization.resolveBestLanguage(langFromHeader);
  }

  if (language === undefined) {
    language = negotiator.language(Localization.languages);
  }

  return language as string;
};

export const negotiateRequest = (request: Request): INegotiationResult => {
  const negotiator = new Negotiator(request);

  return {
    negotiate: negotiator,
    language: lookupLanguage(request, negotiator),
  };
};
