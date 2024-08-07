import { OrdersRepository } from "@/repositories/orders/orders-repository"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { UpdateOrderNameService } from "@/services/update-orders/update-order-name"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function updateOrderName(request: FastifyRequest, response: FastifyReply) {
  try {
    const OrderUncheckedCreateInputSchema = z.object({
      order_custom_id: z.string(),
      orderId: z.string(),
    });

    const { order_custom_id, orderId } = OrderUncheckedCreateInputSchema.parse(request.body)
    const updateOrderNameService = new UpdateOrderNameService(new OrdersRepository())
    await updateOrderNameService.execute({ order_custom_id, orderId })

    response.status(200).send()
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof ResourceNotFoundError) { response.status(500).send({ error: err.message }) }
    throw err
  }
}