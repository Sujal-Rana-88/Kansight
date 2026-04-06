import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMembership } from '../organizations/entities/organization-membership.entity';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    @InjectRepository(OrganizationMembership)
    private readonly memberships: Repository<OrganizationMembership>,
  ) {}

  @Get('events-count')
  async eventsCount(
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.eventsCount(orgId, { from, to });
  }

  @Get('top-events')
  async topEvents(
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.topEvents(orgId, { from, to }, Number(limit ?? 5));
  }

  @Get('product/:productId')
  async productOverview(
    @Param('productId') productId: string,
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.productOverview(orgId, productId);
  }

  @Get('product/:productId/behavior')
  async productBehavior(
    @Param('productId') productId: string,
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.productBehavior(orgId, productId);
  }

  @Get('user/:userId')
  async userOverview(
    @Param('userId') userId: string,
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.userOverview(orgId, userId);
  }

  @Get('funnel')
  async funnel(
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.funnel(orgId);
  }

  @Get('product/:productId/ai-insights')
  async productAiInsights(
    @Param('productId') productId: string,
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.productAiInsights(orgId, productId);
  }

  @Get('user/:userId/ai-profile')
  async userAiProfile(
    @Param('userId') userId: string,
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.userAiProfile(orgId, userId);
  }

  @Get('similar-users')
  async similarUsers(
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
    @Query('user_id') userId: string | undefined,
    @Query('product_id') productId: string | undefined,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    if (!userId && !productId) {
      throw new BadRequestException('user_id or product_id is required.');
    }
    return this.analyticsService.similarUsers(orgId, userId, productId);
  }

  @Get('predict-conversion')
  async predictConversion(
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
    @Query('user_id') userId: string,
    @Query('product_id') productId: string,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    if (!userId || !productId) {
      throw new BadRequestException('user_id and product_id are required.');
    }
    return this.analyticsService.predictConversion(orgId, userId, productId);
  }

  @Get('ai-query')
  async aiQuery(
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
    @Query('q') q: string,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    if (!q) {
      throw new BadRequestException('q is required.');
    }
    return this.analyticsService.aiQuery(orgId, q);
  }

  @Get('anomalies')
  async anomalies(
    @Query('org_id') orgId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.requireOrg(req.user!.id, orgId);
    return this.analyticsService.anomalies(orgId);
  }

  private async requireOrg(userId: string, orgId?: string) {
    if (!orgId) {
      throw new BadRequestException('org_id is required.');
    }
    const membership = await this.memberships.findOne({
      where: { user: { id: userId }, organization: { id: orgId } },
    });
    if (!membership) {
      throw new ForbiddenException('Organization not found.');
    }
  }
}
