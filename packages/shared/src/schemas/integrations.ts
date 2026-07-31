import { z } from 'zod';

export const IntegrationProviderConfigSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  branchId: z.string().uuid().nullable().optional(),
  providerType: z.enum(['PAYMENT', 'DELIVERY', 'MARKETPLACE', 'WHATSAPP', 'SMS', 'EMAIL', 'MAPS', 'AI', 'STORAGE']),
  providerKey: z.string(),
  displayName: z.string(),
  status: z.enum(['DRAFT', 'ACTIVE', 'DISABLED', 'ERROR']),
  credentialsRef: z.string().nullable().optional(),
  configJson: z.any().nullable().optional(),
  webhookSecretRef: z.string().nullable().optional(),
  lastHealthCheckAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateIntegrationProviderConfigSchema = IntegrationProviderConfigSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const WebhookEventSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  providerConfigId: z.string().uuid(),
  providerType: z.string(),
  providerKey: z.string(),
  eventKey: z.string(),
  externalEventId: z.string().nullable().optional(),
  status: z.enum(['RECEIVED', 'VERIFIED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED']),
  headersJson: z.any().nullable().optional(),
  payloadJson: z.any().nullable().optional(),
  receivedAt: z.date(),
  processedAt: z.date().nullable().optional(),
  failureReason: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ExternalReferenceSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  providerType: z.string(),
  providerKey: z.string(),
  entityType: z.string(),
  entityId: z.string().uuid(),
  externalId: z.string(),
  externalUrl: z.string().nullable().optional(),
  metadata: z.any().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
