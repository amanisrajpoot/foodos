export type VehicleType = 'BIKE' | 'CAR' | 'CYCLE' | 'WALK' | 'OTHER';

export type DriverStatus = 'AVAILABLE' | 'ASSIGNED' | 'ON_BREAK' | 'INACTIVE';

export interface Driver {
  id: string;
  organizationId: string;
  branchId: string;
  employeeId?: string | null;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleNumber?: string | null;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryAssignmentStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'CANCELLED';

export interface DeliveryAssignment {
  id: string;
  organizationId: string;
  branchId: string;
  orderId: string;
  customerAddressId: string;
  provider: string;
  driverId?: string | null;
  providerTaskId?: string | null;
  status: DeliveryAssignmentStatus;
  pickupEta?: string | null;
  deliveryEta?: string | null;
  deliveredAt?: string | null;
  failureReason?: string | null;
  trackingUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  driver?: Driver | null;
  order?: any; // Add Order type if available
  customerAddress?: any; // Add CustomerAddress type if available
}

export interface DeliveryEvent {
  id: string;
  organizationId: string;
  deliveryAssignmentId: string;
  eventType: string;
  eventSource: 'LOCAL' | 'PROVIDER_WEBHOOK' | 'STAFF';
  message?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  occurredAt: string;
  createdAt: string;
}
