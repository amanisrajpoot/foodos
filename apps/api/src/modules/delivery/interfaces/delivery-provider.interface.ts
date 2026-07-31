export interface QuoteDeliveryInput {
  organizationId: string;
  branchId: string;
  pickupAddress: {
    latitude?: number;
    longitude?: number;
    addressLine1?: string;
  };
  dropoffAddress: {
    latitude?: number;
    longitude?: number;
    addressLine1?: string;
  };
  orderValueMinor: number;
}

export interface QuoteDeliveryResult {
  estimatedCostMinor: number;
  currency: string;
  etaMinutes?: number;
  providerQuoteId?: string;
}

export interface CreateDeliveryTaskInput {
  deliveryAssignmentId: string;
  organizationId: string;
  branchId: string;
  orderId: string;
  pickupAddress: {
    latitude?: number;
    longitude?: number;
    addressLine1?: string;
    phone?: string;
  };
  dropoffAddress: {
    latitude?: number;
    longitude?: number;
    addressLine1?: string;
    phone?: string;
    name?: string;
  };
}

export interface CreateDeliveryTaskResult {
  providerTaskId: string;
  trackingUrl?: string;
  status: string; // Mapping to internal DeliveryAssignment status
}

export interface DeliveryProvider {
  quoteDelivery(input: QuoteDeliveryInput): Promise<QuoteDeliveryResult>;
  createDeliveryTask(input: CreateDeliveryTaskInput): Promise<CreateDeliveryTaskResult>;
  cancelDeliveryTask(providerTaskId: string): Promise<boolean>;
  trackDelivery(providerTaskId: string): Promise<any>;
  verifyWebhook(payload: any, signature: string): Promise<boolean>;
}
