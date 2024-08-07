import { OrderItems } from "@/repositories/orders/IOrdersRepository"
import { OrdersRepository } from "@/repositories/orders/orders-repository"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { GetOrdersService } from "@/services/get-orders/get-orders"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getOrders(request: FastifyRequest, response: FastifyReply) {
  try {
    const OrderTypeEnum = z.enum(['Intern', 'Personal']);
    const GetOrdersSchema = z.object({
      type: OrderTypeEnum,
      store_id: z.string(),
    });

    const { store_id, type } = GetOrdersSchema.parse(request.body)
    const getOrdersService = new GetOrdersService(new OrdersRepository())

    const { orders } = await getOrdersService.execute({ store_id, type })
    const ordersResponse = orders.map((order) => {
      const orderItems = (order.items || []) as unknown as OrderItems[];
      return {
        ...order, items: orderItems.map(item => {
          const { price_in_cents, ...data } = item
          return {
            ...data,
            price: price_in_cents / 100,
          }
        })
      }
    })

    response.status(200).send({ orders: ordersResponse })
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof ResourceNotFoundError) { response.status(500).send({ error: err.message }) }
    throw err
  }
}