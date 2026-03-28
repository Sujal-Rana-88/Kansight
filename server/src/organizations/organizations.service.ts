import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationMembership } from './entities/organization-membership.entity';
import { User } from '../auth/entities/user.entity';

type Role = 'owner' | 'admin' | 'member';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizations: Repository<Organization>,
    @InjectRepository(OrganizationMembership)
    private readonly memberships: Repository<OrganizationMembership>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async createOrganization(userId: string, name: string, slug: string) {
    if (!name || !slug) {
      throw new BadRequestException('Name and slug are required.');
    }

    const existingSlug = await this.organizations.findOne({ where: { slug } });
    if (existingSlug) {
      throw new BadRequestException('Slug already in use.');
    }

    const owner = await this.users.findOne({ where: { id: userId } });
    if (!owner) {
      throw new NotFoundException('User not found.');
    }

    const organization = await this.organizations.save(
      this.organizations.create({
        name,
        slug,
        owner,
      }),
    );

    await this.memberships.save(
      this.memberships.create({
        user: owner,
        organization,
        role: 'owner',
      }),
    );

    return organization;
  }

  async listOrganizationsForUser(userId: string) {
    const memberships = await this.memberships.find({
      where: { user: { id: userId } },
      relations: ['organization'],
    });
    return memberships.map((m) => m.organization);
  }

  async getOrganization(userId: string, orgId: string) {
    const membership = await this.memberships.findOne({
      where: { user: { id: userId }, organization: { id: orgId } },
      relations: ['organization'],
    });
    if (!membership) {
      throw new NotFoundException('Organization not found.');
    }
    return membership.organization;
  }

  async deleteOrganization(userId: string, orgId: string) {
    const membership = await this.requireRole(userId, orgId, ['owner', 'admin']);
    await this.organizations.remove(membership.organization);
    return { deleted: true };
  }

  async addMember(userId: string, orgId: string, targetUserId: string, role: Role) {
    await this.requireRole(userId, orgId, ['owner', 'admin']);

    const user = await this.users.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const organization = await this.organizations.findOne({ where: { id: orgId } });
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    const existing = await this.memberships.findOne({
      where: { user: { id: targetUserId }, organization: { id: orgId } },
    });
    if (existing) {
      throw new BadRequestException('User already in organization.');
    }

    const memberRole: Role = role ?? 'member';

    return this.memberships.save(
      this.memberships.create({
        user,
        organization,
        role: memberRole,
      }),
    );
  }

  async listMembers(userId: string, orgId: string) {
    await this.requireRole(userId, orgId, ['owner', 'admin', 'member']);
    return this.memberships.find({
      where: { organization: { id: orgId } },
      relations: ['user'],
    });
  }

  async removeMember(userId: string, orgId: string, targetUserId: string) {
    await this.requireRole(userId, orgId, ['owner', 'admin']);
    const membership = await this.memberships.findOne({
      where: { organization: { id: orgId }, user: { id: targetUserId } },
    });
    if (!membership) {
      throw new NotFoundException('Membership not found.');
    }
    if (membership.role === 'owner') {
      throw new ForbiddenException('Cannot remove owner.');
    }
    await this.memberships.remove(membership);
    return { deleted: true };
  }

  async requireRole(userId: string, orgId: string, roles: Role[]) {
    const membership = await this.memberships.findOne({
      where: { user: { id: userId }, organization: { id: orgId } },
      relations: ['organization', 'user'],
    });
    if (!membership) {
      throw new NotFoundException('Organization not found.');
    }
    if (!roles.includes(membership.role as Role)) {
      throw new ForbiddenException('Insufficient role.');
    }
    return membership;
  }
}
