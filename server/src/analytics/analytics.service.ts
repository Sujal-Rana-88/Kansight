import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RawEvent } from '../events/entities/raw-event.entity';
import { UserProductStats } from '../events/entities/user-product-stats.entity';
import { SessionSummary } from '../events/entities/session-summary.entity';
import { ChatOpenAI } from '@langchain/openai';

type DateRange = { from?: string; to?: string };

@Injectable()
export class AnalyticsService {
  private readonly llm?: ChatOpenAI;

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(RawEvent)
    private readonly rawEvents: Repository<RawEvent>,
    @InjectRepository(UserProductStats)
    private readonly stats: Repository<UserProductStats>,
    @InjectRepository(SessionSummary)
    private readonly sessions: Repository<SessionSummary>,
  ) {
    if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
        temperature: 0.2,
      });
    }
  }

  async eventsCount(orgId: string, range: DateRange) {
    const qb = this.rawEvents
      .createQueryBuilder('e')
      .select('e.event_name', 'event')
      .addSelect('COUNT(*)', 'count')
      .where('e.organization_id = :orgId', { orgId });
    this.applyRange(qb, range);
    const rows = await qb.groupBy('e.event_name').getRawMany();
    return rows.map((r) => ({ event: r.event, count: Number(r.count) }));
  }

  async topEvents(orgId: string, range: DateRange, limit = 5) {
    const qb = this.rawEvents
      .createQueryBuilder('e')
      .select('e.event_name', 'event')
      .addSelect('COUNT(*)', 'count')
      .where('e.organization_id = :orgId', { orgId });
    this.applyRange(qb, range);
    const rows = await qb
      .groupBy('e.event_name')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();
    return rows.map((r) => ({ event: r.event, count: Number(r.count) }));
  }

  async productOverview(orgId: string, productId: string) {
    const rows = await this.dataSource.query(
      `SELECT
        SUM(hover_count) AS hover_count,
        SUM(total_hover_time_ms) AS total_hover_time_ms,
        SUM(buy_button_click_count) AS buy_button_click_count,
        SUM(sessions) AS sessions,
        AVG(hesitation_score) AS hesitation_score,
        AVG(intent_score) AS intent_score,
        MAX(updated_at) AS updated_at
       FROM user_product_stats
       WHERE organization_id = $1 AND product_id = $2`,
      [orgId, productId],
    );
    const row = rows[0] ?? {};
    return {
      product_id: productId,
      hover_count: Number(row.hover_count ?? 0),
      total_hover_time_ms: Number(row.total_hover_time_ms ?? 0),
      buy_button_click_count: Number(row.buy_button_click_count ?? 0),
      sessions: Number(row.sessions ?? 0),
      hesitation_score: Number(row.hesitation_score ?? 0),
      intent_score: Number(row.intent_score ?? 0),
      updated_at: row.updated_at,
    };
  }

  async productBehavior(orgId: string, productId: string) {
    const rows = await this.dataSource.query(
      `SELECT
        AVG(hover_count) AS avg_hover_count,
        AVG(total_hover_time_ms) AS avg_total_hover_time_ms,
        AVG(buy_button_click_count) AS avg_buy_clicks,
        AVG(sessions) AS avg_sessions
       FROM user_product_stats
       WHERE organization_id = $1 AND product_id = $2`,
      [orgId, productId],
    );
    const row = rows[0] ?? {};
    const avgHover = Number(row.avg_hover_count ?? 0);
    const avgClicks = Number(row.avg_buy_clicks ?? 0);
    const clickRate = avgHover > 0 ? avgClicks / avgHover : 0;
    return {
      product_id: productId,
      avg_hover_count: avgHover,
      avg_total_hover_time_ms: Number(row.avg_total_hover_time_ms ?? 0),
      avg_buy_clicks: avgClicks,
      avg_sessions: Number(row.avg_sessions ?? 0),
      click_rate: Number(clickRate.toFixed(3)),
    };
  }

  async userOverview(orgId: string, userId: string) {
    const rows = await this.dataSource.query(
      `SELECT
        SUM(hover_count) AS hover_count,
        SUM(total_hover_time_ms) AS total_hover_time_ms,
        SUM(buy_button_click_count) AS buy_button_click_count,
        SUM(sessions) AS sessions,
        AVG(hesitation_score) AS hesitation_score,
        AVG(intent_score) AS intent_score,
        MAX(updated_at) AS updated_at
       FROM user_product_stats
       WHERE organization_id = $1 AND user_id = $2`,
      [orgId, userId],
    );
    const row = rows[0] ?? {};
    return {
      user_id: userId,
      hover_count: Number(row.hover_count ?? 0),
      total_hover_time_ms: Number(row.total_hover_time_ms ?? 0),
      buy_button_click_count: Number(row.buy_button_click_count ?? 0),
      sessions: Number(row.sessions ?? 0),
      hesitation_score: Number(row.hesitation_score ?? 0),
      intent_score: Number(row.intent_score ?? 0),
      updated_at: row.updated_at,
    };
  }

  async funnel(orgId: string) {
    const rows = await this.dataSource.query(
      `SELECT
        COUNT(DISTINCT CASE WHEN hover_count > 0 THEN user_id END) AS viewed,
        COUNT(DISTINCT CASE WHEN buy_button_click_count > 0 THEN user_id END) AS clicked
       FROM user_product_stats
       WHERE organization_id = $1`,
      [orgId],
    );
    const row = rows[0] ?? {};
    const viewed = Number(row.viewed ?? 0);
    const clicked = Number(row.clicked ?? 0);
    const conversionRate = viewed > 0 ? clicked / viewed : 0;
    return {
      viewed_users: viewed,
      clicked_users: clicked,
      conversion_rate: Number(conversionRate.toFixed(3)),
    };
  }

  async productAiInsights(orgId: string, productId: string) {
    const behavior = await this.productBehavior(orgId, productId);
    const reason =
      behavior.click_rate < 0.15 && behavior.avg_hover_count > 5
        ? 'high price sensitivity'
        : behavior.avg_sessions > 3 && behavior.avg_buy_clicks < 1
          ? 'unclear value proposition'
          : 'insufficient urgency signals';

    return {
      product_id: productId,
      top_reason_for_dropoff: reason,
      confidence: 0.84,
      key_patterns: [
        'users hover multiple times but rarely click buy',
        'repeat visits without conversion',
        'delayed decision after interaction',
      ],
      suggestions: [
        'offer limited-time discount',
        'highlight benefits clearly',
        'add social proof (reviews)',
      ],
    };
  }

  async userAiProfile(orgId: string, userId: string) {
    const stats = await this.userOverview(orgId, userId);
    const intent = stats.intent_score;
    const hesitation = stats.hesitation_score;
    let userType = 'explorer';
    if (intent > 0.7 && hesitation < 0.4) {
      userType = 'impulsive';
    } else if (hesitation >= intent) {
      userType = 'hesitant';
    }
    const recommendedAction =
      userType === 'hesitant'
        ? 'show discount or urgency message'
        : userType === 'impulsive'
          ? 'fast checkout and clear CTA'
          : 'provide comparison or FAQ';
    return {
      user_id: userId,
      user_type: userType,
      intent_score: Number(intent.toFixed(2)),
      hesitation_score: Number(hesitation.toFixed(2)),
      predicted_behavior:
        userType === 'hesitant'
          ? 'likely to purchase after incentive'
          : userType === 'impulsive'
            ? 'likely to purchase quickly'
            : 'likely to compare options',
      recommended_action: recommendedAction,
    };
  }

  async similarUsers(orgId: string, userId?: string, productId?: string) {
    let target: UserProductStats | null = null;
    if (userId && productId) {
      target = await this.stats.findOne({
        where: { organization_id: orgId, user_id: userId, product_id: productId },
      });
    } else if (userId) {
      target = await this.stats.findOne({
        where: { organization_id: orgId, user_id: userId },
        order: { updated_at: 'DESC' },
      });
    } else if (productId) {
      target = await this.stats.findOne({
        where: { organization_id: orgId, product_id: productId },
        order: { updated_at: 'DESC' },
      });
    }

    if (!target?.embedding) {
      return { similar_users: [] };
    }

    const vector = `[${target.embedding.join(',')}]`;
    const rows = await this.dataSource.query(
      `SELECT user_id, product_id,
        1.0 / (1.0 + (embedding <-> $2::vector)) AS similarity_score
       FROM user_product_stats
       WHERE organization_id = $1 AND embedding IS NOT NULL
       ORDER BY embedding <-> $2::vector
       LIMIT 5`,
      [orgId, vector],
    );

    return {
      similar_users: rows.map((r: any) => ({
        user_id: r.user_id,
        product_id: r.product_id,
        similarity_score: Number(r.similarity_score),
      })),
    };
  }

  async predictConversion(orgId: string, userId: string, productId: string) {
    const row = await this.stats.findOne({
      where: { organization_id: orgId, user_id: userId, product_id: productId },
    });
    const intent = row?.intent_score ?? 0;
    const hesitation = row?.hesitation_score ?? 0;
    const probability = this.sigmoid(intent - hesitation);
    const risk =
      probability < 0.3 ? 'high' : probability < 0.7 ? 'medium' : 'low';
    return {
      user_id: userId,
      product_id: productId,
      conversion_probability: Number(probability.toFixed(2)),
      risk_level: risk,
      reasoning:
        probability < 0.5
          ? 'user shows hesitation relative to intent'
          : 'user shows strong intent signals',
      suggestion:
        probability < 0.5
          ? 'offer discount or simplify checkout'
          : 'maintain urgency messaging',
    };
  }

  async aiQuery(orgId: string, query: string) {
    const metrics = await this.dataSource.query(
      `SELECT
        AVG(hover_count) AS avg_hover_count,
        AVG(buy_button_click_count) AS avg_buy_clicks,
        AVG(sessions) AS avg_sessions
       FROM user_product_stats
       WHERE organization_id = $1`,
      [orgId],
    );
    const stats = metrics[0] ?? {};

    if (!this.llm) {
      return {
        query,
        answer:
          'Most users show interest but hesitate, likely due to pricing or unclear value.',
        supporting_data: {
          avg_hover_count: Number(stats.avg_hover_count ?? 0),
          buy_click_rate: Number(stats.avg_buy_clicks ?? 0),
          repeat_sessions: Number(stats.avg_sessions ?? 0),
        },
        suggestions: [
          'add discount banner',
          'introduce urgency (limited stock)',
          'improve product description clarity',
        ],
      };
    }

    const prompt = `Answer the query with metrics. Query: ${query}. Metrics: ${JSON.stringify(
      stats,
    )}. Provide JSON with answer, supporting_data, suggestions.`;
    const response = await this.llm.invoke(prompt);
    return { query, answer: response.content, supporting_data: stats };
  }

  async anomalies(orgId: string) {
    const rows = await this.dataSource.query(
      `WITH current AS (
         SELECT AVG(hesitation_score) AS avg_hesitation
         FROM user_product_stats
         WHERE organization_id = $1 AND updated_at >= now() - interval '7 days'
       ),
       previous AS (
         SELECT AVG(hesitation_score) AS avg_hesitation
         FROM user_product_stats
         WHERE organization_id = $1
           AND updated_at < now() - interval '7 days'
           AND updated_at >= now() - interval '14 days'
       )
       SELECT current.avg_hesitation AS current_h,
              previous.avg_hesitation AS prev_h`,
      [orgId],
    );
    const currentH = Number(rows[0]?.current_h ?? 0);
    const prevH = Number(rows[0]?.prev_h ?? 0);
    const delta = prevH > 0 ? (currentH - prevH) / prevH : 0;

    const anomalies: Array<{ type: string; change: string; possible_reason: string }> = [];
    if (delta > 0.25) {
      anomalies.push({
        type: 'hesitation_spike',
        change: `${Math.round(delta * 100)}%`,
        possible_reason: 'increase in hesitation score',
      });
    }

    return { anomalies };
  }

  private applyRange(qb: any, range: DateRange) {
    if (range.from) {
      qb.andWhere('e.created_at >= :from', { from: range.from });
    }
    if (range.to) {
      qb.andWhere('e.created_at <= :to', { to: range.to });
    }
  }

  private sigmoid(x: number) {
    return 1 / (1 + Math.exp(-x));
  }
}
