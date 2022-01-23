import { Logger, TLogEntryType } from '@/libs/logger';
import { is } from '@/utils';
import { ReportAdapter } from '../ReportAdapter';

export class LoggerReportAdapter extends ReportAdapter {
  public processedReportData: TLogEntryType[];
  public logger: Logger;

  constructor(reportData: unknown[]) {
    super(reportData);
    this.processedReportData = this.processReportData(reportData);
    this.logger = new Logger('Report');
  }

  private processReportData(reportData: unknown[]) {
    const result: TLogEntryType[] = [];

    for (const rd of reportData) {
      if (is.oneOf(['string', 'number', 'boolean', 'object', Error], rd)) {
        result.push(rd as TLogEntryType);
      }
    }

    return result;
  }

  report() {
    if (this.processedReportData.length > 0) {
      this.logger.error(...this.processedReportData);
    }
  }
}
