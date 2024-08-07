import { OrdersRepository } from "@/repositories/orders/orders-repository"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { DeleteOrderService } from "@/services/update-orders/delete-order"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function deleteOrder(request: FastifyRequest, response: FastifyReply) {
  try {
    const OrderUncheckedCreateInputSchema = z.object({
      orderId: z.string(),
    });

    const { orderId } = OrderUncheckedCreateInputSchema.parse(request.body)
    const deleteOrderService = new DeleteOrderService(new OrdersRepository())
    await deleteOrderService.execute({ orderId })

    response.status(200).send()
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof ResourceNotFoundError) { response.status(500).send({ error: err.message }) }
    throw err
  }
}