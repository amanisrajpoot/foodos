export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  status: string;
}

export interface Organization {
  id: string;
  legalName: string;
  tradeName?: string | null;
  slug: string;
  countryCode: string;
  defaultCurrency: string;
  status: string;
}

export interface Restaurant {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  status: string;
}

export interface Branch {
  id: string;
  organizationId: string;
  restaurantId: string;
  name: string;
  branchCode: string;
  branchType: string;
  status: string;
}

export interface Role {
  id: string;
  organizationId: string;
  name: string;
  isSystemRole: boolean;
  status: string;
}

export interface Employee {
  id: string;
  organizationId: string;
  restaurantId?: string | null;
  branchId?: string | null;
  userId?: string | null;
  employeeCode: string;
  fullName: string;
  jobTitle: string;
  status: string;
}

export interface Department {
  id: string;
  organizationId: string;
  branchId: string;
  name: string;
  departmentType: string;
  status: string;
}

export interface DiningTable {
  id: string;
  organizationId: string;
  branchId: string;
  label: string;
  capacity: number;
  qrCode?: string | null;
  status: string;
}

// Menu Domain Types
export interface Menu {
  id: string;
  organizationId: string;
  restaurantId: string;
  branchId?: string | null;
  name: string;
  menuType: string;
  status: string;
  startsAt?: Date | null;
  endsAt?: Date | null;
  sortOrder: number;
}

export interface MenuCategory {
  id: string;
  organizationId: string;
  menuId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  status: string;
}

export interface MenuItem {
  id: string;
  organizationId: string;
  restaurantId: string;
  branchId?: string | null;
  sku?: string | null;
  name: string;
  description?: string | null;
  itemType: string;
  dietaryType?: string | null;
  basePriceMinor: number;
  currency: string;
  taxCategoryId?: string | null;
  imageUrl?: string | null;
  preparationMinutes?: number | null;
  isRecommended: boolean;
  isStockTracked: boolean;
  status: string;
}

export interface MenuItemPlacement {
  id: string;
  organizationId: string;
  menuId: string;
  categoryId: string;
  menuItemId: string;
  sortOrder: number;
  visibleChannels: string[];
  status: string;
}

export interface ModifierGroup {
  id: string;
  organizationId: string;
  restaurantId: string;
  menuItemId?: string | null;
  name: string;
  selectionType: string;
  minSelections: number;
  maxSelections: number;
  isRequired: boolean;
  sortOrder: number;
  status: string;
}

export interface ModifierOption {
  id: string;
  organizationId: string;
  modifierGroupId: string;
  name: string;
  priceDeltaMinor: number;
  currency: string;
  isDefault: boolean;
  sortOrder: number;
  status: string;
}

export interface PriceRule {
  id: string;
  organizationId: string;
  restaurantId: string;
  branchId?: string | null;
  menuItemId: string;
  channel: string;
  priceMinor: number;
  currency: string;
  startsAt?: Date | null;
  endsAt?: Date | null;
  priority: number;
  status: string;
}

export interface ItemAvailability {
  id: string;
  organizationId: string;
  menuItemId: string;
  branchId?: string | null;
  channel: string;
  dayOfWeek?: number | null;
  startTimeLocal?: string | null;
  endTimeLocal?: string | null;
  manualOverride: string;
  reason?: string | null;
}

// Finance Domain Types
export interface TaxCategory {
  id: string;
  organizationId: string;
  name: string;
  countryCode: string;
  taxType: string;
  ratePercent: number;
  isInclusive: boolean;
  status: string;
}

// Orders, Kitchen, and POS Domain Types
export interface Order {
  id: string;
  organizationId: string;
  restaurantId: string;
  branchId: string;
  orderNumber: string;
  channel: string;
  source: string;
  customerId?: string | null;
  tableId?: string | null;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  serviceChargeMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  currency: string;
  notes?: string | null;
  placedAt?: Date | null;
  acceptedAt?: Date | null;
  completedAt?: Date | null;
  cancelledAt?: Date | null;
  cancelReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  organizationId: string;
  orderId: string;
  menuItemId: string;
  nameSnapshot: string;
  quantity: number;
  unitPriceMinor: number;
  discountMinor: number;
  taxMinor: number;
  lineTotalMinor: number;
  currency: string;
  specialInstructions?: string | null;
  status: string;
}

export interface KitchenTicket {
  id: string;
  organizationId: string;
  branchId: string;
  orderId: string;
  ticketNumber: string;
  station: string;
  priority: string;
  status: string;
  printedAt?: Date | null;
  acceptedAt?: Date | null;
  readyAt?: Date | null;
}

export interface KitchenTicketItem {
  id: string;
  organizationId: string;
  kitchenTicketId: string;
  orderItemId: string;
  nameSnapshot: string;
  quantity: number;
  station: string;
  status: string;
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PLACED = 'PLACED',
  ACCEPTED = 'ACCEPTED',
  IN_KITCHEN = 'IN_KITCHEN',
  READY = 'READY',
  SERVED = 'SERVED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum KitchenTicketStatus {
  QUEUED = 'QUEUED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
}

// Inventory Domain Types
export interface Ingredient {
  id: string;
  organizationId: string;
  restaurantId?: string | null;
  name: string;
  sku?: string | null;
  category?: string | null;
  unitOfMeasure: string;
  purchaseUnitOfMeasure: string;
  conversionFactor: number;
  preferredSupplierId?: string | null;
  lowStockThreshold: number;
  parLevel: number;
  isPerishable: boolean;
  shelfLifeDays?: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockLot {
  id: string;
  organizationId: string;
  branchId: string;
  ingredientId: string;
  lotCode?: string | null;
  quantityOnHand: number;
  unitOfMeasure: string;
  unitCostMinor: number;
  currency: string;
  receivedAt: Date;
  expiresAt?: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  organizationId: string;
  branchId: string;
  ingredientId: string;
  stockLotId?: string | null;
  movementType: string;
  quantityDelta: number;
  unitOfMeasure: string;
  unitCostMinor: number;
  currency: string;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  organizationId: string;
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  gstin?: string | null;
  address?: string | null;
  paymentTermsDays?: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrder {
  id: string;
  organizationId: string;
  branchId: string;
  supplierId: string;
  poNumber: string;
  status: string;
  orderedAt?: Date | null;
  expectedAt?: Date | null;
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderLine {
  id: string;
  organizationId: string;
  purchaseOrderId: string;
  ingredientId: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitOfMeasure: string;
  unitCostMinor: number;
  taxMinor: number;
  lineTotalMinor: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WasteEntry {
  id: string;
  organizationId: string;
  branchId: string;
  ingredientId: string;
  stockLotId?: string | null;
  quantity: number;
  unitOfMeasure: string;
  reason: string;
  notes?: string | null;
  recordedByEmployeeId?: string | null;
  recordedAt: Date;
  approvedByUserId?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeLine {
  id: string;
  organizationId: string;
  menuItemId: string;
  ingredientId: string;
  quantity: number;
  unitOfMeasure: string;
  wasteFactorPercent: number;
  isOptional: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryAlert {
  id: string;
  organizationId: string;
  branchId: string;
  ingredientId: string;
  alertType: string;
  severity: string;
  message: string;
  recommendedQuantity?: number | null;
  unitOfMeasure?: string | null;
  source: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Payments & Finance Domain
// ==========================================

export interface Payment {
  id: string;
  organizationId: string;
  branchId: string;
  orderId: string;
  paymentNumber: string;
  provider: string;
  method: string;
  status: string;
  amountMinor: number;
  currency: string;
  providerPaymentId?: string | null;
  providerOrderId?: string | null;
  failureCode?: string | null;
  failureMessage?: string | null;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  organizationId: string;
  branchId: string;
  orderId: string;
  invoiceNumber: string;
  status: string;
  customerName?: string | null;
  customerGstin?: string | null;
  billingAddress?: string | null;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency: string;
  issuedAt?: Date | null;
  voidedAt?: Date | null;
  pdfUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Integrations Domain
// ==========================================

export interface IntegrationProviderConfig {
  id: string;
  organizationId: string;
  branchId?: string | null;
  providerType: string;
  providerKey: string;
  displayName: string;
  status: string;
  credentialsRef?: string | null;
  configJson?: any;
  webhookSecretRef?: string | null;
  lastHealthCheckAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookEvent {
  id: string;
  organizationId: string;
  providerConfigId: string;
  providerType: string;
  providerKey: string;
  eventKey: string;
  externalEventId?: string | null;
  status: string;
  headersJson?: any;
  payloadJson?: any;
  receivedAt: Date;
  processedAt?: Date | null;
  failureReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExternalReference {
  id: string;
  organizationId: string;
  providerType: string;
  providerKey: string;
  entityType: string;
  entityId: string;
  externalId: string;
  externalUrl?: string | null;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// CRM Domain Types
// ==========================================

export interface Customer {
  id: string;
  organizationId: string;
  restaurantId?: string | null;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  dateOfBirth?: Date | null;
  anniversaryDate?: Date | null;
  tags: string[];
  marketingOptIn: boolean;
  whatsappOptIn: boolean;
  emailOptIn: boolean;
  smsOptIn: boolean;
  lifetimeSpendMinor: number;
  orderCount: number;
  lastOrderAt?: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface CustomerAddress {
  id: string;
  organizationId: string;
  customerId: string;
  label?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  countryCode: string;
  latitude?: number | null;
  longitude?: number | null;
  deliveryInstructions?: string | null;
  isDefault: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface Review {
  id: string;
  organizationId: string;
  restaurantId?: string | null;
  branchId?: string | null;
  customerId: string;
  orderId?: string | null;
  rating: number;
  comment?: string | null;
  reviewSource: string;
  status: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface WalletTransaction {
  id: string;
  organizationId: string;
  customerId: string;
  transactionType: string;
  amountMinor: number;
  currency: string;
  balanceAfterMinor: number;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
  createdAt: Date;
  version: number;
}

