import { Order } from "@prisma/client";

export type OrderType = 'Intern' | 'Personal'
export type OrderStatus = 'InUse' | 'Available'

export interface OrderItems {
  id: string,
  name: string,
  description: string,
  quantity: number,
  price_in_cents: number,
}
export interface OrderUncheckedCreateInput {
  type: OrderType
  items: OrderItems[]
  store_id: string
  status?: OrderStatus
  order_custom_id: string
}

export interface IOrdersRepository {
  getAllOrders(type: OrderType, store_id: string): Promise<Order[]>

  create({ type, items, store_id, status, order_custom_id }: OrderUncheckedCreateInput): Promise<Order>

  cleanOrder(orderId: string): Promise<void>
  updateOrderName(orderId: string, order_custom_id: string): Promise<Order>
  openOrder(newItems: OrderItems[], orderId: string): Promise<Order>

  updateItems(newItems: OrderItems[], orderId: string): Promise<Order>

  delete(orderId: string): Promise<void>
}