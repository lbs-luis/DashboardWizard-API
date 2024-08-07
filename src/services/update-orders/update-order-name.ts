import { IOrdersRepository, OrderItems, OrderUncheckedCreateInput } from "@/repositories/orders/IOrdersRepository"

interface IServiceRequest {
  orderId: string
  order_custom_id: string
}
interface IServiceResponse {

}

export class UpdateOrderNameService {
  constructor(private ordersRepository: IOrdersRepository) { }

  async execute({ orderId, order_custom_id }: IServiceRequest): Promise<void> {

    await this.ordersRepository.updateOrderName(orderId, order_custom_id)
  }
}