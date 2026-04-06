import { Injectable, Logger } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { DataSource } from 'typeorm';
import { UserProductStats } from '../events/entities/user-product-stats.entity';

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);
  private readonly embeddings: OpenAIEmbeddings;

  constructor(private readonly dataSource: DataSource) {
    this.embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
    });
  }

  async updateEmbedding(stats: UserProductStats) {
    if (!process.env.OPENAI_API_KEY) {
      return;
    }

    const summary = this.summaryText(stats);
    const embedding = await this.embedText(summary);

    await this.dataSource.query(
      `UPDATE user_product_stats
       SET embedding = $1::vector, updated_at = now()
       WHERE organization_id = $2 AND user_id = $3 AND product_id = $4`,
      [this.vectorToSql(embedding), stats.organization_id, stats.user_id, stats.product_id],
    );
  }

  summaryText(stats: UserProductStats) {
    return `User hovered ${stats.hover_count} times with total hover time ${
      stats.total_hover_time_ms
    }ms, clicked ${stats.click_count} times, sessions ${stats.sessions}, hesitation ${
      stats.hesitation_score
    }, intent ${stats.intent_score}.`;
  }

  async embedText(text: string) {
    return this.embeddings.embedQuery(text);
  }

  private vectorToSql(vector: number[]) {
    return `[${vector.join(',')}]`;
  }
}
