import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { Organization } from './entities/organization.entity';
import { OrganizationMembership } from './entities/organization-membership.entity';
import { Project } from './entities/project.entity';
import { User } from '../auth/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { ProjectsController } from '../projects/projects.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationMembership, Project, User]),
  ],
  controllers: [OrganizationsController, ProjectsController],
  providers: [OrganizationsService, ProjectsService],
})
export class OrganizationsModule {}
