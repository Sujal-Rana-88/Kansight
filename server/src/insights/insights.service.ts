import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { DataSource } from 'typeorm';
import { UserProductStats } from '../events/entities/user-product-stats.entity';
import { EmbeddingsService } from './embeddings.service';

@Injectable()
export class InsightsService {
  private readonly llm: ChatOpenAI;

  constructor(
    private readonly dataSource: DataSource,
    private readonly embeddingsService: EmbeddingsService,
  ) {
    this.llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
      temperature: 0.2,
    });
  }

  async explain(orgId: string, userId: string, productId: string) {
    const stats = await this.dataSource.getRepository(UserProductStats).findOne({
      where: { organization_id: orgId, user_id: userId, product_id: productId },
    });
    if (!stats) {
      throw new NotFoundException('User/product stats not found.');
    }

    const summary = this.embeddingsService.summaryText(stats);
    const embedding = await this.embeddingsService.embedText(summary);

    const similar = await this.dataSource.query(
      `SELECT user_id, product_id, hesitation_score, intent_score
       FROM user_product_stats
       WHERE organization_id = $1
       ORDER BY embedding <-> $2::vector
       LIMIT 5`,
      [orgId, `[${embedding.join(',')}]`],
    );

    if (!process.env.OPENAI_API_KEY) {
      return {
        reason: 'LLM not configured. Provide OPENAI_API_KEY to enable insights.',
        confidence: 0,
        suggestion: 'Configure LLM to generate insights.',
        similar,
      };
    }

    const prompt = `You are an analytics expert. Analyze the user behavior summary and similar users.
Summary: ${summary}
Similar users: ${JSON.stringify(similar)}
Return JSON with reason, confidence (0-1), suggestion.`;

    const response = await this.llm.invoke(prompt);
    return { message: response.content, similar };
  }
}
