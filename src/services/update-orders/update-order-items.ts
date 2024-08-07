import { Order } from "@prisma/client"
import { IOrdersRepository, OrderItems, OrderUncheckedCreateInput } from "@/repositories/orders/IOrdersRepository"

interface IServiceRequest {
  newItems: OrderItems[], orderId: string
}
interface IServiceResponse {
  order: Order
}

export class UpdateOrdersItemsService {
  constructor(private ordersRepository: IOrdersRepository) { }

  async execute({ newItems, orderId }: IServiceRequest): Promise<IServiceResponse> {

    const order = await this.ordersRepository.updateItems(newItems, orderId)

    return {
      order
    }
  }
}