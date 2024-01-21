import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { StoreRepository as MedusaStoreRepository } from '@medusajs/medusa/dist/repositories/store';
import { Store } from '../models/store';

export const StoreRepository = dataSource.getRepository(Store).extend({
  ...Object.assign(MedusaStoreRepository, { target: Store }),
});

export default StoreRepository;
