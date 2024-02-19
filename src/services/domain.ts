import { Lifetime } from "awilix"
import {
    StoreService as MedusaStoreService, Store, User,
} from "@medusajs/medusa"
import StoreRepository from 'src/repositories/store';
import ProductService from "./product";

class DomainService extends MedusaStoreService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly loggedInUser_: User | null;
    protected storeRepository_: typeof StoreRepository;
    protected readonly productService_: ProductService

    constructor(container, options) {
        // @ts-expect-error prefer-rest-params
        super(...arguments)
        try {
            //  this.loggedInUser_ = container.loggedInUser
            this.productService_ = container.productService
        } catch (e) {
            // avoid errors when backend first runs
            console.log("storeService Error : ", e)
        }
    }

    // In StoreService.ts
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

    async fetchProductsByDomain(domain: string): Promise<any[]> {
        const store = await this.storeRepository_.findOne({ where: { domain } });
        if (!store) {
            throw new Error('Store not found');
        }
        console.log("prod_01HNFXM9YZM8PHCCJEJV4WN16E");
        return this.productService_.fetchProducts(store.id);
    }
}


export default DomainService;