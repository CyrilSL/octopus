import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Permission } from '../models/permission';

export const PermissionRepository = dataSource.getRepository(Permission);

export default PermissionRepository;
