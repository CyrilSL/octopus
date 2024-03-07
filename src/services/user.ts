import { Lifetime } from "awilix"
import { UserService as MedusaUserService } from "@medusajs/medusa"
import { User } from "../models/user"
import { CreateUserInput as MedusaCreateUserInput } from "@medusajs/medusa/dist/types/user"
import { 
  UpdateUserInput,
} from "@medusajs/medusa/dist/types/user"

import StoreRepository from "../repositories/store"

type CreateUserInput = {
  store_id?: string
} & MedusaCreateUserInput

class UserService extends MedusaUserService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly loggedInUser_: User | null
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.storeRepository_ = container.storeRepository

    try {
      this.loggedInUser_ = container.loggedInUser
      console.log("Logged In User userService : ",this.loggedInUser_.email)
    } catch (e) {
      // avoid errors when backend first runs
     // console.log("userService error : ",e)
    }
  }

  async create(user: CreateUserInput, password: string): Promise<User> {
    if (!user.store_id) {
      const storeRepo = this.manager_.withRepository(this.storeRepository_)
      let newStore = storeRepo.create()
      newStore = await storeRepo.save(newStore)
      user.store_id = newStore.id
    }

    return await super.create(user, password)
  }

  async update(userId: string, update: UpdateUserInput & {
    role_id?: string
  }): Promise<User> {
    return super.update(userId, update)
  }

  // async delete(userId: string): Promise<void> {
  //   const userRepository = this.manager_.withRepository(this.storeRepository_)
  //   const user = await userRepository.findOne({ where: { id: "usr_01HQZ3EY27G4RH8N9KQ6RDDFXM" } });
  //   console.log("User ID.. : ",userId)
  //   if (user) {
  //     console.log("Deleting user : ",user)
  //     await userRepository.remove(user);
  //   }
  // }

  // async deleteMultiple(userIds: string[]): Promise<void> {
  //   const userRepository = this.manager_.withRepository(this.storeRepository_)

  //   // Assuming a hard delete, adjust based on your needs (e.g., soft delete might set a flag instead)
  //   for (const userId of userIds) {
  //     const user = await userRepository.findOne({ where: { id: userId } });
  //     if (user) {
  //       await userRepository.remove(user);
  //     }
  //   }
  // }
}



export default UserService