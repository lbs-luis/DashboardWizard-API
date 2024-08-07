import { Order } from "@prisma/client"
import { IOrdersRepository, OrderItems, OrderUncheckedCreateInput } from "@/repositories/orders/IOrdersRepository"

interface IServiceRequest {
  orderId: string
}
interface IServiceResponse {

}

export class DeleteOrderService {
  constructor(private ordersRepository: IOrdersRepository) { }

  async execute({ orderId }: IServiceRequest): Promise<void> {

    await this.ordersRepository.delete(orderId)
  }
}