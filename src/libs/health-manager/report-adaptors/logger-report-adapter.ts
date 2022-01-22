import { logger, TLogEntryType } from '@/libs/logger';
import { ReportAdapter } from '../ReportAdapter';

export class LoggerReportAdapter extends ReportAdapter {
  public processedReportData: TLogEntryType[];

  constructor(reportData: unknown[]) {
    super(reportData);
    this.processedReportData = this.processReportData(reportData);
  }

  private processReportData(reportData: unknown[]) {
    const result: TLogEntryType[] = [];

    for (const rd of reportData) {
      if (['string', 'number', 'boolean', 'object'].includes(typeof rd) || rd instanceof Error) {
        result.push(rd as TLogEntryType);
      }
    }

    return result;
  }

  report() {
    if (this.processedReportData.length > 0) {
      logger.error(...this.processedReportData);
    }
  }
}
