import { Store } from "@prisma/client"
import { IStoresRepository } from "@/repositories/stores/IStoresRepository"

interface IGetStoresServiceRequest {
  userId: string
}

interface IGetStoresServiceResponse {
  stores: Store[]
}

export class GetAllUserStoresService {
  constructor(private storesRepository: IStoresRepository) { }

  async execute({ userId }: IGetStoresServiceRequest): Promise<IGetStoresServiceResponse> {
    const stores = await this.storesRepository.findAllUserStores(userId)

    return {
      stores
    }
  }
}