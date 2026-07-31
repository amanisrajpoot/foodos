export interface KpiSnapshot {
  id: string;
  organizationId: string;
  restaurantId?: string;
  branchId?: string;
  metricKey: string;
  domain: string;
  periodType: string;
  periodStart: Date;
  periodEnd: Date;
  valueNumeric?: number;
  valueJson?: any;
  computedAt: Date;
}

export interface DailyBusinessSummary {
  id: string;
  organizationId: string;
  restaurantId?: string;
  branchId?: string;
  businessDate: Date;
  summaryText: string;
  salesTotalMinor: number;
  orderCount: number;
  topItemsJson?: any;
  lowStockItemsJson?: any;
  customerHighlightsJson?: any;
  riskFlagsJson?: any;
  generatedBy: string;
  generatedAt: Date;
}
