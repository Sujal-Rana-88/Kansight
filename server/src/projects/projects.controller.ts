import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':projectId')
  getProject(@Param('projectId') projectId: string, @Req() req: AuthenticatedRequest) {
    return this.projectsService.getProject(req.user!.id, projectId);
  }

  @Delete(':projectId')
  deleteProject(@Param('projectId') projectId: string, @Req() req: AuthenticatedRequest) {
    return this.projectsService.deleteProject(req.user!.id, projectId);
  }

  @Post(':id/api-key')
  rotateApiKey(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.projectsService.rotateApiKey(req.user!.id, id);
  }
}
