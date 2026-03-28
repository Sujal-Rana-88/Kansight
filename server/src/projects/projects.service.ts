import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../organizations/entities/project.entity';
import { OrganizationMembership } from '../organizations/entities/organization-membership.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projects: Repository<Project>,
    @InjectRepository(OrganizationMembership)
    private readonly memberships: Repository<OrganizationMembership>,
    @InjectRepository(Organization)
    private readonly organizations: Repository<Organization>,
  ) {}

  async getProject(userId: string, projectId: string) {
    const project = await this.projects.findOne({
      where: { id: projectId },
      relations: ['organization'],
    });
    if (!project) {
      throw new NotFoundException('Project not found.');
    }
    await this.requireOrgMembership(userId, project.organization.id, [
      'owner',
      'admin',
      'member',
    ]);
    return project;
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.projects.findOne({
      where: { id: projectId },
      relations: ['organization'],
    });
    if (!project) {
      throw new NotFoundException('Project not found.');
    }
    await this.requireOrgMembership(userId, project.organization.id, [
      'owner',
      'admin',
    ]);
    await this.projects.remove(project);
    return { deleted: true };
  }

  async rotateApiKey(userId: string, projectId: string) {
    const project = await this.projects.findOne({
      where: { id: projectId },
      relations: ['organization'],
    });
    if (!project) {
      throw new NotFoundException('Project not found.');
    }
    await this.requireOrgMembership(userId, project.organization.id, [
      'owner',
      'admin',
    ]);
    project.api_key = randomBytes(24).toString('hex');
    await this.projects.save(project);
    return { api_key: project.api_key };
  }

  private async requireOrgMembership(
    userId: string,
    orgId: string,
    roles: Array<'owner' | 'admin' | 'member'>,
  ) {
    const membership = await this.memberships.findOne({
      where: { user: { id: userId }, organization: { id: orgId } },
      relations: ['organization', 'user'],
    });
    if (!membership) {
      throw new NotFoundException('Organization not found.');
    }
    if (!roles.includes(membership.role as 'owner' | 'admin' | 'member')) {
      throw new ForbiddenException('Insufficient role.');
    }
    return membership;
  }
}
