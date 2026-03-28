import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post('organizations')
  createOrganization(
    @Body() body: { name?: string; slug?: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.createOrganization(
      req.user!.id,
      body.name ?? '',
      body.slug ?? '',
    );
  }

  @Get('organizations')
  listOrganizations(@Req() req: AuthenticatedRequest) {
    return this.organizationsService.listOrganizationsForUser(req.user!.id);
  }

  @Get('organizations/:orgId')
  getOrganization(@Param('orgId') orgId: string, @Req() req: AuthenticatedRequest) {
    return this.organizationsService.getOrganization(req.user!.id, orgId);
  }

  @Delete('organizations/:orgId')
  deleteOrganization(@Param('orgId') orgId: string, @Req() req: AuthenticatedRequest) {
    return this.organizationsService.deleteOrganization(req.user!.id, orgId);
  }

  @Post('organizations/:orgId/members')
  addMember(
    @Param('orgId') orgId: string,
    @Body() body: { userId?: string; role?: 'owner' | 'admin' | 'member' },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.addMember(
      req.user!.id,
      orgId,
      body.userId ?? '',
      body.role ?? 'member',
    );
  }

  @Get('organizations/:orgId/members')
  listMembers(@Param('orgId') orgId: string, @Req() req: AuthenticatedRequest) {
    return this.organizationsService.listMembers(req.user!.id, orgId);
  }

  @Delete('organizations/:orgId/members/:userId')
  removeMember(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.removeMember(req.user!.id, orgId, userId);
  }

  @Get('me/organizations')
  currentUserOrganizations(@Req() req: AuthenticatedRequest) {
    return this.organizationsService.listOrganizationsForUser(req.user!.id);
  }
}
