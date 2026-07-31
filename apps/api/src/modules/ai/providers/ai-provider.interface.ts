export interface AiInsightContext {
  organizationId: string;
  branchId?: string;
  dateRangeDays?: number;
  recentKpis?: any[];
  lowStockItems?: any[];
  recentOrderStats?: any;
}

export interface AiInsightResult {
  insightType: 'SALES' | 'INVENTORY' | 'KITCHEN' | 'CUSTOMER' | 'MARKETING' | 'FINANCE' | 'SUPPORT';
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  body: string;
  recommendation?: string;
  sourceEntityType?: string;
  sourceEntityId?: string;
  confidenceScore?: number;
}

export interface AiSummaryContext {
  organizationId: string;
  branchId?: string;
  businessDate: string;
  salesTotalMinor: number;
  orderCount: number;
  topItems?: any[];
  lowStockItems?: any[];
  riskFlags?: any[];
  kpiSnapshots?: any[];
}

export interface AiInventoryContext {
  organizationId: string;
  branchId?: string;
  ingredientId: string;
  ingredientName: string;
  unitOfMeasure: string;
  currentQuantityOnHand: number;
  lowStockThreshold: number;
  parLevel: number;
  consumptionHistory: { date: string; quantityDelta: number }[];
  preferredSupplier?: { name: string; paymentTermsDays?: number };
}

export interface AiInventoryPrediction {
  predictedStockoutDate: Date;
  predictedDaysRemaining: number;
  recommendedQuantity: number;
  recommendation: string;
  confidenceScore: number;
}

export interface AiProvider {
  readonly providerName: string;
  readonly defaultModelName: string;

  generateInsights(context: AiInsightContext): Promise<AiInsightResult[]>;
  generateNarrativeSummary(context: AiSummaryContext): Promise<{ narrative: string; anomalies: string[] }>;
  generateInventoryPrediction(context: AiInventoryContext): Promise<AiInventoryPrediction>;
}
