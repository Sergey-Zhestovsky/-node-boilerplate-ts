import { InitOptions, ReadCallback, Services } from 'i18next';
import FsBackend from 'i18next-fs-backend';

import { IBackendOptions } from '../types';

export class Backend extends FsBackend {
  static fileNameToNamespace(str: string) {
    return str.replace(/-(\w)/g, (_, symbol: string) => symbol.toUpperCase());
  }

  static namespaceToFileName(str: string) {
    return str.replace(/([A-Z])/g, (_, symbol: string) => `-${symbol.toLowerCase()}`);
  }

  private normalizeNamespaceFilenames = false;

  private getNormalizedFilename(namespace: string) {
    return this.normalizeNamespaceFilenames ? Backend.namespaceToFileName(namespace) : namespace;
  }

  init(services: Services, backendOptions: IBackendOptions, i18nextOptions: InitOptions): void {
    this.normalizeNamespaceFilenames = backendOptions.normalizeNamespaceFilenames ?? false;
    return super.init(services, backendOptions, i18nextOptions);
  }

  read(language: string, namespace: string, callback: ReadCallback): void {
    return super.read(language, this.getNormalizedFilename(namespace), callback);
  }

  create(languages: string[], namespace: string, key: string, fallbackValue: string): void {
    return super.create(languages, this.getNormalizedFilename(namespace), key, fallbackValue);
  }

  writeFile(lng: string, namespace: string): void {
    return super.writeFile(lng, this.getNormalizedFilename(namespace));
  }
}
