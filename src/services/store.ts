import { Lifetime } from "awilix"
import { 
  FindConfig,
  StoreService as MedusaStoreService, Store, User,
} from "@medusajs/medusa"
import StoreRepository from 'src/repositories/store';




class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED
   protected readonly loggedInUser_: User | null
  protected storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when backend first runs
      // console.log("storeService Error : ",e)
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

// In StoreService.ts
  // Method to update the store's domain
  async listAllStores(): Promise<Store[]> {
    // Use the storeRepository to access all stores
    const stores = await this.storeRepository_.find();
    return stores;
  }

  async findByDomain(domainName: string): Promise<Store | undefined> {
    const store = await this.storeRepository_.findOne({
      where: {
        domain: domainName,
      },
    });
    
    return store;
  }

}


export default StoreService