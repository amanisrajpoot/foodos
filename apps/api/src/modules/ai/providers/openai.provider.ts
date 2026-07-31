import { Injectable, Logger } from '@nestjs/common';
import {
  AiProvider,
  AiInsightContext,
  AiInsightResult,
  AiSummaryContext,
  AiInventoryContext,
  AiInventoryPrediction,
} from './ai-provider.interface';

@Injectable()
export class OpenAiProvider implements AiProvider {
  private readonly logger = new Logger(OpenAiProvider.name);
  readonly providerName = 'OPENAI';
  readonly defaultModelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  private readonly apiKey = process.env.OPENAI_API_KEY || '';
  private readonly baseUrl =
    process.env.AI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  private async callChatCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.apiKey && !process.env.AI_BASE_URL) {
      throw new Error('OPENAI_API_KEY or AI_BASE_URL is not configured in environment.');
    }

    const endpoint = `${this.baseUrl.replace(/\/$/, '')}/chat/completions`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.defaultModelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      this.logger.error(`OpenAI API request failed: ${response.status} - ${errText}`);
      throw new Error(`OpenAI API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '{}';
  }

  async generateInsights(context: AiInsightContext): Promise<AiInsightResult[]> {
    try {
      const systemPrompt = `You are FoodOS AI, an expert restaurant analytics assistant. Analyze restaurant KPI data and output structured actionable insights in JSON format:
{
  "insights": [
    {
      "insightType": "SALES" | "INVENTORY" | "KITCHEN" | "CUSTOMER" | "MARKETING" | "FINANCE",
      "severity": "INFO" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "title": "Short title",
      "body": "Detailed insight explanation",
      "recommendation": "Concrete suggested action",
      "confidenceScore": number between 0 and 1
    }
  ]
}`;

      const userPrompt = `Restaurant KPI context: ${JSON.stringify(context)}. Provide 3 top actionable insights.`;
      const rawJson = await this.callChatCompletion(systemPrompt, userPrompt);
      const parsed = JSON.parse(rawJson);

      return parsed.insights || [];
    } catch (err) {
      this.logger.warn(`OpenAI insight generation error, falling back: ${err.message}`);
      return [];
    }
  }

  async generateNarrativeSummary(
    context: AiSummaryContext,
  ): Promise<{ narrative: string; anomalies: string[] }> {
    try {
      const systemPrompt = `You are FoodOS AI. Write an engaging, concise end-of-day daily business summary narrative for a restaurant owner. Format JSON:
{
  "narrative": "Detailed narrative string...",
  "anomalies": ["Anomaly 1", "Anomaly 2"]
}`;

      const userPrompt = `Summary context: ${JSON.stringify(context)}`;
      const rawJson = await this.callChatCompletion(systemPrompt, userPrompt);
      const parsed = JSON.parse(rawJson);

      return {
        narrative: parsed.narrative || 'Summary processed successfully.',
        anomalies: parsed.anomalies || [],
      };
    } catch (err) {
      this.logger.warn(`OpenAI summary generation error: ${err.message}`);
      return {
        narrative: `Daily summary for ${context.businessDate}: Sales ₹${(context.salesTotalMinor / 100).toFixed(2)} across ${context.orderCount} orders.`,
        anomalies: [],
      };
    }
  }

  async generateInventoryPrediction(
    context: AiInventoryContext,
  ): Promise<AiInventoryPrediction> {
    try {
      const systemPrompt = `You are FoodOS AI inventory analyst. Predict stockout timeline and reorder recommendations based on historical consumption. Format JSON:
{
  "predictedDaysRemaining": number,
  "recommendedQuantity": number,
  "recommendation": "string",
  "confidenceScore": number
}`;

      const userPrompt = `Inventory item context: ${JSON.stringify(context)}`;
      const rawJson = await this.callChatCompletion(systemPrompt, userPrompt);
      const parsed = JSON.parse(rawJson);

      const daysRemaining = parsed.predictedDaysRemaining || 3;
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + Math.max(1, Math.round(daysRemaining)));

      return {
        predictedStockoutDate: stockoutDate,
        predictedDaysRemaining: Math.round(daysRemaining * 10) / 10,
        recommendedQuantity: parsed.recommendedQuantity || context.parLevel,
        recommendation: parsed.recommendation || `Reorder stock soon for ${context.ingredientName}.`,
        confidenceScore: parsed.confidenceScore || 0.85,
      };
    } catch (err) {
      this.logger.warn(`OpenAI inventory prediction error: ${err.message}`);
      const fallbackDays = 3;
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + fallbackDays);
      return {
        predictedStockoutDate: fallbackDate,
        predictedDaysRemaining: fallbackDays,
        recommendedQuantity: context.parLevel - context.currentQuantityOnHand,
        recommendation: `Reorder stock for ${context.ingredientName} based on usage trend.`,
        confidenceScore: 0.75,
      };
    }
  }
}
