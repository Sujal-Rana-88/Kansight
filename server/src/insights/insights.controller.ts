import { Controller, Get, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { InsightsService } from './insights.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMembership } from '../organizations/entities/organization-membership.entity';

@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightsController {
  constructor(
    private readonly insightsService: InsightsService,
    @InjectRepository(OrganizationMembership)
    private readonly memberships: Repository<OrganizationMembership>,
  ) {}

  @Get(':orgId/users/:userId/products/:productId')
  async explain(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const membership = await this.memberships.findOne({
      where: { user: { id: req.user!.id }, organization: { id: orgId } },
    });
    if (!membership) {
      throw new ForbiddenException('Organization not found.');
    }
    return this.insightsService.explain(orgId, userId, productId);
  }
}
