import { TReportAdapterClass } from './ReportAdapter';

interface IHealthManagerConstructor {
  reportAdapters?: TReportAdapterClass[];
}

export class HealthManager {
  private readonly reportAdapters: TReportAdapterClass[];

  constructor(options: IHealthManagerConstructor = {}) {
    this.reportAdapters = options.reportAdapters ?? [];
  }

  report(...error: unknown[]) {
    this.reportAdapters.forEach((Adapter) => {
      const adapter = new Adapter(error);
      adapter.report();
    });
  }
}
