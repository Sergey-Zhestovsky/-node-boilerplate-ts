import fs from 'fs';
import path from 'path';
import i18next, { i18n, StringMap, TOptions } from 'i18next';

import { config } from '@/libs/config';
import { flattenObject } from '@/utils';
import { Backend } from './plugins';
import { strings } from './strings';
import { ENamespace, IGeneratedOptions, IInitOptions, IOptions } from './types';

class Localization {
  private static getLocalizationFolderPaths(rootPath: string, missingFoldername: string) {
    return {
      filePath: path.join(rootPath, '/{{lng}}/{{ns}}.json'),
      missingKeysFilePath: path.join(rootPath, `/{{lng}}/${missingFoldername}/{{ns}}.json`),
    };
  }

  private static prepareAndProcessLocalizationFolders(options: IOptions) {
    const {
      baseLanguage,
      baseNamespace,
      localizationRootPath: rootPath,
      foldernameForMissingKeys,
      normalizeNamespaceNames = false,
    } = options;

    const result: IGeneratedOptions = {
      languages: [],
      namespaces: [],
    };

    result.languages = fs.readdirSync(rootPath);
    const baseLanguagePath = path.join(rootPath, baseLanguage);

    if (!result.languages.includes(baseLanguage) || !fs.lstatSync(baseLanguagePath).isDirectory()) {
      throw new Error(`Base language folder '${baseLanguage}' in not found by path: ${rootPath}`);
    }

    for (const lang of result.languages) {
      const missingLangPath = path.join(rootPath, lang, foldernameForMissingKeys);

      if (!fs.existsSync(missingLangPath) || !fs.lstatSync(missingLangPath).isDirectory()) {
        fs.mkdirSync(missingLangPath, { recursive: true });
      }
    }

    result.namespaces = fs
      .readdirSync(baseLanguagePath)
      .filter((fileName) => {
        const filePath = path.join(baseLanguagePath, fileName);
        return fs.lstatSync(filePath).isFile();
      })
      .map((fileName) => {
        const namespace = path.parse(fileName).name;
        return normalizeNamespaceNames ? Backend.fileNameToNamespace(namespace) : namespace;
      });

    if (!result.namespaces.includes(baseNamespace)) {
      throw new Error(
        `List of namespaces in the the base language folder does not include '${baseNamespace}' namespace`
      );
    }

    return result;
  }

  private static getI18nOptions(options: IOptions, genOpts: IGeneratedOptions): IInitOptions {
    const { filePath, missingKeysFilePath } = Localization.getLocalizationFolderPaths(
      options.localizationRootPath,
      options.foldernameForMissingKeys
    );

    return {
      initImmediate: false,
      lng: options.baseLanguage,
      fallbackLng: options.baseLanguage,
      defaultNS: options.baseNamespace,
      supportedLngs: genOpts.languages,
      preload: genOpts.languages,
      ns: genOpts.namespaces,
      backend: {
        loadPath: filePath,
        addPath: missingKeysFilePath,
        normalizeNamespaceFilenames: options.normalizeNamespaceNames,
      },
      saveMissing: true,
      saveMissingTo: 'current',
      missingKeyNoValueFallbackToKey: true,
    };
  }

  private static getReversedVocabulary(vocabulary: DeepObject<string>) {
    const entries = Object.entries(flattenObject(vocabulary)).map(([k, v]) => {
      return [v, k.replace(/(?<!\\)\./, ':')];
    });

    return Object.fromEntries(entries) as Record<string, string>;
  }

  private readonly i18n: i18n;
  private readonly reversedVocabulary: Record<string, string>;

  constructor(options: IOptions) {
    const genOpts = Localization.prepareAndProcessLocalizationFolders(options);

    this.i18n = i18next.createInstance(Localization.getI18nOptions(options, genOpts));
    this.reversedVocabulary = Localization.getReversedVocabulary(this.strings);
  }

  async init() {
    return this.i18n.use(Backend).init();
  }

  async awaitInit() {
    return new Promise<void>((resolve, reject) => {
      if (this.i18n.isInitialized) return resolve();

      const resolveOnce = () => {
        resolve();
        this.i18n.off('initialized', resolveOnce);
      };

      this.i18n.on('initialized', resolveOnce);
    });
  }

  get initialized() {
    return this.i18n.isInitialized;
  }

  get strings() {
    return strings;
  }

  get mainLanguage() {
    return this.i18n.options.lng;
  }

  get languages() {
    return this.i18n.options.supportedLngs ? [...this.i18n.options.supportedLngs] : [];
  }

  private checkForInit() {
    if (!this.initialized) throw new Error('Localization needs to be initialized');
  }

  resolveBestLanguage(lang: string[] | string) {
    // eslint-disable-next-line
    return localization.i18n.services.languageUtils.getBestMatchFromCodes(
      Array.isArray(lang) ? lang : [lang]
    ) as string;
  }

  getResourceBundle(lng: string, ns: ENamespace) {
    return this.i18n.getResourceBundle(lng, ns) as DeepObject<string> | undefined;
  }

  getAllNamespaceTranslations(ns: ENamespace) {
    const result: Record<string, DeepObject<string>> = {};

    for (const lng of this.languages) {
      const translate = this.getResourceBundle(lng, ns);
      if (translate) result[lng] = translate;
    }

    return result;
  }

  translate(strPath: string, optionsOrLang?: TOptions<StringMap> | string) {
    this.checkForInit();

    const options = typeof optionsOrLang === 'string' ? { lng: optionsOrLang } : optionsOrLang;
    return this.i18n.t(strPath, options);
  }

  translateStr(text: string, optionsOrLang?: TOptions<StringMap> | string) {
    this.checkForInit();

    const options = typeof optionsOrLang === 'string' ? { lng: optionsOrLang } : optionsOrLang;
    const keyPath = this.reversedVocabulary[text] as string | undefined;
    if (keyPath === undefined) return text;

    return this.i18n.t(keyPath.replace(/\\./g, '.'), options);
  }
}

export const localization = new Localization(config.global.localization);
