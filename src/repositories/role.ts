import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Role } from '../models/role';

export const RoleRepository = dataSource.getRepository(Role);

export default RoleRepository;
