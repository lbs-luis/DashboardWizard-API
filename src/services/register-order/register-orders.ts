import { Order } from "@prisma/client"
import { IOrdersRepository, OrderUncheckedCreateInput } from "@/repositories/orders/IOrdersRepository"

interface IServiceRequest extends OrderUncheckedCreateInput {
}
interface IServiceResponse {
  order: Order
}

export class RegisterOrdersService {
  constructor(private ordersRepository: IOrdersRepository) { }

  async execute({ items, store_id, type, status, order_custom_id }: IServiceRequest): Promise<IServiceResponse> {
    const order = await this.ordersRepository.create({
      items,
      store_id,
      type,
      status,
      order_custom_id
    })

    return {
      order
    }
  }
}