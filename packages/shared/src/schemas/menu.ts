import { z } from 'zod';

export const MenuSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  branchId: z.string().uuid().nullable().optional(),
  name: z.string().min(1, 'Name is required'),
  menuType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY', 'CATERING', 'ALL_DAY', 'CUSTOM']),
  status: z.enum(['DRAFT', 'ACTIVE', 'SCHEDULED', 'ARCHIVED']),
  startsAt: z.date().nullable().optional(),
  endsAt: z.date().nullable().optional(),
  sortOrder: z.number().int().default(0),
});
export const CreateMenuSchema = MenuSchema.omit({ id: true });
export const UpdateMenuSchema = MenuSchema.partial().omit({ id: true, organizationId: true });

export const MenuCategorySchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  menuId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().default(0),
  status: z.enum(['ACTIVE', 'HIDDEN', 'ARCHIVED']),
});
export const CreateMenuCategorySchema = MenuCategorySchema.omit({ id: true });
export const UpdateMenuCategorySchema = MenuCategorySchema.partial().omit({ id: true, organizationId: true });

export const MenuItemSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  branchId: z.string().uuid().nullable().optional(),
  sku: z.string().nullable().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  itemType: z.enum(['FOOD', 'BEVERAGE', 'PACKAGING', 'SERVICE', 'COMBO']),
  dietaryType: z.enum(['VEG', 'NON_VEG', 'EGG', 'VEGAN', 'JAIN', 'OTHER']).nullable().optional(),
  basePriceMinor: z.number().int().min(0, 'Price cannot be negative'),
  currency: z.string().default('INR'),
  taxCategoryId: z.string().uuid().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  preparationMinutes: z.number().int().nullable().optional(),
  isRecommended: z.boolean().default(false),
  isStockTracked: z.boolean().default(false),
  status: z.enum(['DRAFT', 'ACTIVE', 'UNAVAILABLE', 'ARCHIVED']),
});
export const CreateMenuItemSchema = MenuItemSchema.omit({ id: true });
export const UpdateMenuItemSchema = MenuItemSchema.partial().omit({ id: true, organizationId: true });

export const MenuItemPlacementSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  menuId: z.string().uuid(),
  categoryId: z.string().uuid(),
  menuItemId: z.string().uuid(),
  sortOrder: z.number().int().default(0),
  visibleChannels: z.array(z.string()),
  status: z.enum(['ACTIVE', 'HIDDEN']),
});
export const CreateMenuItemPlacementSchema = MenuItemPlacementSchema.omit({ id: true });
export const UpdateMenuItemPlacementSchema = MenuItemPlacementSchema.partial().omit({ id: true, organizationId: true });

export const ModifierGroupSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  menuItemId: z.string().uuid().nullable().optional(),
  name: z.string().min(1, 'Name is required'),
  selectionType: z.enum(['SINGLE', 'MULTIPLE']),
  minSelections: z.number().int().min(0),
  maxSelections: z.number().int().min(1),
  isRequired: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.enum(['ACTIVE', 'ARCHIVED']),
});
export const CreateModifierGroupSchema = ModifierGroupSchema.omit({ id: true });
export const UpdateModifierGroupSchema = ModifierGroupSchema.partial().omit({ id: true, organizationId: true });

export const ModifierOptionSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  modifierGroupId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  priceDeltaMinor: z.number().int().min(0),
  currency: z.string().default('INR'),
  isDefault: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.enum(['ACTIVE', 'UNAVAILABLE', 'ARCHIVED']),
});
export const CreateModifierOptionSchema = ModifierOptionSchema.omit({ id: true });
export const UpdateModifierOptionSchema = ModifierOptionSchema.partial().omit({ id: true, organizationId: true });

export const PriceRuleSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  branchId: z.string().uuid().nullable().optional(),
  menuItemId: z.string().uuid(),
  channel: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY', 'MARKETPLACE', 'ALL']).default('ALL'),
  priceMinor: z.number().int().min(0),
  currency: z.string().default('INR'),
  startsAt: z.date().nullable().optional(),
  endsAt: z.date().nullable().optional(),
  priority: z.number().int().default(0),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});
export const CreatePriceRuleSchema = PriceRuleSchema.omit({ id: true });
export const UpdatePriceRuleSchema = PriceRuleSchema.partial().omit({ id: true, organizationId: true });

export const ItemAvailabilitySchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  menuItemId: z.string().uuid(),
  branchId: z.string().uuid().nullable().optional(),
  channel: z.string().default('ALL'),
  dayOfWeek: z.number().int().min(0).max(6).nullable().optional(),
  startTimeLocal: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable().optional(),
  endTimeLocal: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable().optional(),
  manualOverride: z.enum(['AVAILABLE', 'UNAVAILABLE', 'NONE']).default('NONE'),
  reason: z.string().nullable().optional(),
});
export const CreateItemAvailabilitySchema = ItemAvailabilitySchema.omit({ id: true });
export const UpdateItemAvailabilitySchema = ItemAvailabilitySchema.partial().omit({ id: true, organizationId: true });
