import { Lifetime } from "awilix"
import { 
  FindConfig,
  StoreService as MedusaStoreService, Store, User,
} from "@medusajs/medusa"

class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly loggedInUser_: User | null

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)

    try {
      this.loggedInUser_ = container.loggedInUser
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async retrieve(config?: FindConfig<Store>): Promise<Store> {
    if (!this.loggedInUser_) {
      return super.retrieve(config);
    }

    return this.retrieveForLoggedInUser(config);
  }

  async retrieveForLoggedInUser(config?: FindConfig<Store>) {
    const storeRepo = this.manager_.withRepository(this.storeRepository_);

    // Ensure that the config object and its relations property are defined
    const effectiveConfig = {
        ...config,
        relations: config && config.relations ? [...config.relations, 'members'] : ['members']
    };

    const store = await storeRepo.findOne({
        ...effectiveConfig,
        where: {
            id: this.loggedInUser_.store_id
        },
    });

    if (!store) {
        throw new Error('Unable to find the user store');
    }

    return store;
}

  // Method to update the store's domain
  async updateStoreDomain(storeId: string, domain: string): Promise<Store> {
    const store = await this.storeRepository_.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    store.domain = domain;
    await this.storeRepository_.save(store);

    return store;
  }

}

export default StoreService