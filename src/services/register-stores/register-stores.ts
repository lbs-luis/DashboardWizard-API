import { Prisma, Store } from "@prisma/client"
import { IStoresRepository } from "@/repositories/stores/IStoresRepository"

interface IRegisterStoresServiceRequest extends Prisma.StoreUncheckedCreateInput {
}

interface IRegisterStoresServiceResponse {
  store: Store
}

export class RegisterStoresService {
  constructor(private storesRepository: IStoresRepository) { }

  async execute({ description, manager_id, name, store_custom_id, }: IRegisterStoresServiceRequest): Promise<IRegisterStoresServiceResponse> {
    // const { } = this.usersRepository.find
    const store = await this.storesRepository.create({ description, manager_id, name, store_custom_id })

    return {
      store
    }
  }
}