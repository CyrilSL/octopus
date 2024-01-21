import { TransactionBaseService } from '@medusajs/medusa';
import { Role } from '../models/role';
import RoleRepository from '../repositories/role';
import PermissionService, { CreatePayload as PermissionCreatePayload } from './permission';
import UserService from './user';

type CreatePayload = Pick<Role, 'name' | 'store_id'> & {
  permissions?: PermissionCreatePayload[];
};

type InjectedDependencies = {
  roleRepository: typeof RoleRepository;
  permissionService: PermissionService;
  userService: UserService;
};

class RoleService extends TransactionBaseService {
  protected readonly roleRepository_: typeof RoleRepository;
  protected readonly permissionService_: PermissionService;
  protected readonly userService_: UserService;

  constructor(container: InjectedDependencies) {
    super(container);

    this.roleRepository_ = container.roleRepository;
    this.permissionService_ = container.permissionService;
    this.userService_ = container.userService;
  }

  // Retrieves a role with its relations
  async retrieve(id: string): Promise<Role> {
    // for simplicity, we retrieve all relations
    // however, it's best to supply the relations
    // as an optional method parameter
    const roleRepo = this.manager_.withRepository(this.roleRepository_);
    return await roleRepo.findOne({
      where: {
        id,
      },
      relations: ['permissions', 'store', 'users'],
    });
  }

  // Creates a new role and, if provided, its permissions as well
  async create(data: CreatePayload): Promise<Role> {
    // TODO: add validation

    return this.atomicPhase_(async (manager) => {
      // omitting validation for simplicity
      const { permissions: permissionsData = [] } = data;
      delete data.permissions;

      const roleRepo = manager.withRepository(this.roleRepository_);
      const role = roleRepo.create(data);

      role.permissions = [];

      for (const permissionData of permissionsData) {
        role.permissions.push(await this.permissionService_.create(permissionData));
      }
      const result = await roleRepo.save(role);

      return await this.retrieve(result.id);
    });
  }

  // Associates a user with a role
  async associateUser(role_id: string, user_id: string): Promise<Role> {
    // TODO: add validation
    return this.atomicPhase_(async () => {
      // omitting validation for simplicity
      await this.userService_.update(user_id, {
      //Check back later role_id,
      });

      return await this.retrieve(role_id);
    });
  }
}

export default RoleService;
