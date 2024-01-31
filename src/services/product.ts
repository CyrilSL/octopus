import { ProductService as MedusaProductService, User } from '@medusajs/medusa';
import {
  FindProductConfig,
  CreateProductInput as MedusaCreateProductInput,
  ProductSelector as MedusaProductSelector,
} from '@medusajs/medusa/dist/types/product';
import { Lifetime } from 'awilix';
import { Product } from 'src/models/product';
import ProductRepository from 'src/repositories/products';
import StoreRepository from 'src/repositories/store';

type ProductSelector = MedusaProductSelector;

type CreateProductInput = MedusaCreateProductInput;

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInUser_: User | null;
  protected productRepository_: typeof ProductRepository;
  protected storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.productRepository_ = container.productRepository;
    this.storeRepository_=container.storeRepository;

    try {
      this.loggedInUser_ = container.loggedInUser;
//    this.productRepository_ = container.productRepository;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async list(selector: ProductSelector, config?: FindProductConfig): Promise<Product[]> {
    // Adjusted to not filter by store_id
    return await super.list(selector, config);
  }

  async listAndCount(selector: ProductSelector, config?: FindProductConfig): Promise<[Product[], number]> {
    // Adjusted to not filter by store_id
    return await super.listAndCount(selector, config);
  }

  async retrieve(productId: string, config?: FindProductConfig): Promise<Product> {
    // Adjusted to not check for store_id
    const product = await super.retrieve(productId, config);
    return product;
  }

  async create(productObject: CreateProductInput): Promise<Product> {
    // Product creation no longer assigns store_id upon creation
    return await super.create(productObject);
  }

//Receives Store ID and Product Id and saves in store_products // Works with only one product
  // async addProducts(storeId: string, productId: string): Promise<void> {
  //   const entityManager = this.manager_;  // Assuming this.manager_ is an instance of EntityManager
  //   await entityManager.transaction(async transactionalEntityManager => {
  //     await transactionalEntityManager
  //       .createQueryBuilder()
  //       .insert()
  //       .into('store_products')
  //       .values({ store_id: storeId, product_id: productId })
  //       .execute();
  //       console.log("SQL Query: 1");
  //   });
  // }

  // Modifies the addProducts function to accept an array of productIds
  //Adds Multiple products, recieves as array and adds Product to mini Store
async addProducts(storeId: string, productIds: string[]): Promise<void> {
  const entityManager = this.manager_;  // Assuming this.manager_ is an instance of EntityManager
  await entityManager.transaction(async transactionalEntityManager => {
    // Map each productId to an object that matches the structure of the store_products table
    const productsToAdd = productIds.map(productId => ({
      store_id: storeId,
      product_id: productId
    }));

    // Use the `insert` method to add all mapped products to the store_products table in one operation
    await transactionalEntityManager
      .createQueryBuilder()
      .insert()
      .into('store_products')
      .values(productsToAdd)  // Insert multiple rows at once
      .execute();
  });
}


//From Mini store
  async fetchProducts(storeId: string): Promise<Product[]> {
    // Assuming 'product' is the alias for the products table
    // and 'store_products' is a join table between stores and products
    return await this.productRepository_
      .createQueryBuilder("product")
      .innerJoin("store_products", "sp", "sp.product_id = product.id")
      .where("sp.store_id = :storeId", { storeId })
      .getMany();
  }


  //removes multiple product from mini store- recieves array of products and store id
  async removeProducts(storeId: string, productIds: string[]): Promise<void> {
    const entityManager = this.manager_;
    await entityManager.transaction(async transactionalEntityManager => {
      // Efficiently handle the deletion of multiple products
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from('store_products')
        .where("store_id = :storeId", { storeId })
        .andWhere("product_id IN (:...productIds)", { productIds }) // Use IN for multiple productIds
        .execute();
    });
  }
  
  
  
  
   
  }
export default ProductService;
