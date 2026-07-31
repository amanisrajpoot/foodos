import { z } from 'zod';

export const TaxCategorySchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  countryCode: z.string().length(2, 'Country code must be 2 characters'),
  taxType: z.enum(['GST', 'VAT', 'SALES_TAX', 'SERVICE_TAX', 'OTHER']),
  ratePercent: z.number().min(0, 'Rate must be positive'),
  isInclusive: z.boolean(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const CreateTaxCategorySchema = TaxCategorySchema.omit({ id: true });
export const UpdateTaxCategorySchema = TaxCategorySchema.partial().omit({ id: true, organizationId: true });
