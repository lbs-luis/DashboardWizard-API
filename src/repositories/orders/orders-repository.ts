import { prisma } from "@/lib/prisma";
import { IOrdersRepository, OrderItems, OrderType, OrderUncheckedCreateInput } from "./IOrdersRepository";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { Prisma } from "@prisma/client";
import { OrderAlreadyExistsError } from "@/services/errors/order-already-exists-error";

export class OrdersRepository implements IOrdersRepository {
  async getAllOrders(type: OrderType, store_id: string) {
    const storeExists = await prisma.store.findUnique({
      where: {
        id: store_id
      }
    })
    if (!storeExists) throw new ResourceNotFoundError()

    const orders = await prisma.order.findMany({
      where: {
        store_id,
        type,
      }
    })
    return orders
  }

  async create({ type, items, store_id, status, order_custom_id }: OrderUncheckedCreateInput) {
    const storeExists = await prisma.store.findUnique({
      where: {
        id: store_id
      }
    })
    if (!storeExists) throw new ResourceNotFoundError()
    const hasOrdersWithSameCustomId = await prisma.order.findMany({
      where: {
        order_custom_id
      }
    })
    const orderAlreadyExists = hasOrdersWithSameCustomId.some((order) => order.store_id === store_id)
    if (orderAlreadyExists) throw new OrderAlreadyExistsError()

    const order = await prisma.order.create({
      data: {
        items: items as unknown as Prisma.InputJsonValue,
        type,
        status,
        store_id,
        order_custom_id
      }
    })

    return order
  }

  async updateItems(newItems: OrderItems[], orderId: string) {
    const orderExists = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    })
    if (!orderExists) throw new ResourceNotFoundError()

    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        items: newItems as unknown as Prisma.InputJsonValue
      }
    })

    return order
  }

  async openOrder(newItems: OrderItems[], orderId: string) {
    const orderExists = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    })
    if (!orderExists) throw new ResourceNotFoundError()

    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        items: newItems as unknown as Prisma.InputJsonValue,
        status: 'InUse'
      }
    })

    return order
  }

  async cleanOrder(orderId: string) {
    const orderExists = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    })
    if (!orderExists) throw new ResourceNotFoundError()

    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        items: [] as unknown as Prisma.InputJsonValue,
        status: 'Available'
      }
    })
  }

  async updateOrderName(orderId: string, order_custom_id: string) {
    const orderExists = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    })
    if (!orderExists) throw new ResourceNotFoundError()

    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        order_custom_id
      }
    })

    return order
  }

  async delete(orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      }
    })
    if (!order) throw new ResourceNotFoundError()

    await prisma.order.delete({
      where: {
        id: order.id
      }
    })
  }
}