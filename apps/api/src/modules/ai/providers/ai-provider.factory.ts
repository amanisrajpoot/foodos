import { Injectable, Logger } from '@nestjs/common';
import { AiProvider } from './ai-provider.interface';
import { MockAiProvider } from './mock-ai.provider';
import { OpenAiProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';

@Injectable()
export class AiProviderFactory {
  private readonly logger = new Logger(AiProviderFactory.name);

  constructor(
    private readonly mockAiProvider: MockAiProvider,
    private readonly openAiProvider: OpenAiProvider,
    private readonly geminiProvider: GeminiProvider,
  ) {}

  getProvider(providerType?: string): AiProvider {
    const selected = (providerType || process.env.AI_PROVIDER || 'mock').toLowerCase();

    switch (selected) {
      case 'openai':
      case 'custom':
      case 'local':
        this.logger.log(`Using OpenAI / Custom LLM Provider (${selected})`);
        return this.openAiProvider;
      case 'gemini':
        this.logger.log('Using Gemini LLM Provider');
        return this.geminiProvider;
      case 'mock':
      default:
        this.logger.log('Using Mock LLM Provider');
        return this.mockAiProvider;
    }
  }
}
