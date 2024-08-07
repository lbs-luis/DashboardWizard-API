import { Store } from "@prisma/client"
import { IStoresRepository } from "@/repositories/stores/IStoresRepository"

interface IServiceRequest {
  store_custom_id: string
}

interface IServiceResponse {
  store: Store | null
}

export class GetStoreService {
  constructor(private storeRepository: IStoresRepository) { }

  async execute({ store_custom_id }: IServiceRequest): Promise<IServiceResponse> {
    const store = await this.storeRepository.findByCustomId(store_custom_id)

    return {
      store
    }
  }
}