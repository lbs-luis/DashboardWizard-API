import { OrdersRepository } from "@/repositories/orders/orders-repository"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { OrderAlreadyExistsError } from "@/services/errors/order-already-exists-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { RegisterOrdersService } from "@/services/register-order/register-orders"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function registerOrder(request: FastifyRequest, response: FastifyReply) {
  try {
    const OrderTypeEnum = z.enum(['Intern', 'Personal']);
    const OrderStatusEnum = z.enum(['InUse', 'Available']);
    const OrderItemsSchema = z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      quantity: z.number().nonnegative(),
      price: z.number().nonnegative(),
    });
    const OrderUncheckedCreateInputSchema = z.object({
      type: OrderTypeEnum,
      items: z.array(OrderItemsSchema),
      store_id: z.string(),
      status: OrderStatusEnum.optional(),
      order_custom_id: z.string()
    });

    const { items, store_id, type, status, order_custom_id } = OrderUncheckedCreateInputSchema.parse(request.body)
    const registerOrdersService = new RegisterOrdersService(new OrdersRepository())
    const { order } = await registerOrdersService.execute({
      items: items.map((item) => {
        const { price, ...itemData } = item;

        return {
          ...itemData,
          price_in_cents: Math.round(price * 100),
        };
      }), store_id, type, status, order_custom_id
    })

    response.status(200).send({ order })
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof ResourceNotFoundError || err instanceof OrderAlreadyExistsError) { response.status(400).send({ error: err.message }) }
    throw err
  }
}