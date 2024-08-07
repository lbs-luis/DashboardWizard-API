import { Store } from "@prisma/client"
import { IStoresRepository } from "@/repositories/stores/IStoresRepository"

interface IGetStoresServiceRequest {
  manager_id: string
}

interface IGetStoresServiceResponse {
  stores: Store[]
}

export class GetAllManagerStoresService {
  constructor(private storesRepository: IStoresRepository) { }

  async execute({ manager_id }: IGetStoresServiceRequest): Promise<IGetStoresServiceResponse> {
    const stores = await this.storesRepository.findAllManagerStores(manager_id)

    return {
      stores
    }
  }
}