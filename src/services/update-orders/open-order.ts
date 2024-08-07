import { Order } from "@prisma/client"
import { IOrdersRepository, OrderItems } from "@/repositories/orders/IOrdersRepository"

interface IServiceRequest {
  newItems: OrderItems[], orderId: string
}
interface IServiceResponse {
  order: Order
}

export class OpenOrderService {
  constructor(private ordersRepository: IOrdersRepository) { }

  async execute({ newItems, orderId }: IServiceRequest): Promise<IServiceResponse> {

    const order = await this.ordersRepository.openOrder(newItems, orderId)

    return {
      order
    }
  }
}