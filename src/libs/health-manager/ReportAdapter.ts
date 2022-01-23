export type TReportAdapterClass = new (reportData: unknown[]) => ReportAdapter;

export abstract class ReportAdapter {
  constructor(public reportData: unknown[]) {}

  abstract report(): void;
}
