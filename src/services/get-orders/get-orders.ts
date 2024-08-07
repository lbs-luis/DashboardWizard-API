import { Order } from "@prisma/client"
import { IOrdersRepository, OrderType } from "@/repositories/orders/IOrdersRepository"

interface IServiceRequest {
  type: OrderType,
  store_id: string
}
interface IServiceResponse {
  orders: Order[]
}

export class GetOrdersService {
  constructor(private ordersRepository: IOrdersRepository) { }

  async execute({ store_id, type }: IServiceRequest): Promise<IServiceResponse> {
    const orders = await this.ordersRepository.getAllOrders(type, store_id)
    return {
      orders
    }
  }
}