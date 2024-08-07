import { OrdersRepository } from "@/repositories/orders/orders-repository"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { UpdateOrdersItemsService } from "@/services/update-orders/update-order-items"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function updateOrderItems(request: FastifyRequest, response: FastifyReply) {
  try {
    const OrderItemsSchema = z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      quantity: z.number().nonnegative(),
      price: z.number().nonnegative(),
    });
    const OrderUncheckedCreateInputSchema = z.object({
      items: z.array(OrderItemsSchema),
      id: z.string(),
    });

    const { items, id } = OrderUncheckedCreateInputSchema.parse(request.body)
    const updateOrdersItemsService = new UpdateOrdersItemsService(new OrdersRepository())
    const { order } = await updateOrdersItemsService.execute({
      newItems: items.map((item) => {
        const { price, ...itemData } = item;

        return {
          ...itemData,
          price_in_cents: Math.round(price * 100),
        };
      }), orderId: id
    })

    response.status(200).send({ order })
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof ResourceNotFoundError) { response.status(500).send({ error: err.message }) }
    throw err
  }
}