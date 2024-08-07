import { Order, Prisma } from "@prisma/client";
import { IOrdersRepository, OrderType, OrderUncheckedCreateInput, OrderItems } from "@/repositories/orders/IOrdersRepository";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";

export class InMemoryOrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];
  private stores: { id: string }[] = [{ id: 'store-0' }];

  async getAllOrders(type: OrderType, store_id: string): Promise<Order[]> {
    const storeExists = this.stores.some(store => store.id === store_id);
    if (!storeExists) throw new ResourceNotFoundError();

    return this.orders.filter(order => order.store_id === store_id && order.type === type);
  }

  async create({ type, items, store_id, status, order_custom_id }: OrderUncheckedCreateInput): Promise<Order> {
    const storeExists = this.stores.some(store => store.id === store_id);
    if (!storeExists) throw new ResourceNotFoundError();

    const newOrder: Order = {
      id: `order-${this.orders.length}`,
      items: items as unknown as Prisma.JsonValue,
      type,
      status: status || 'Available',
      store_id,
      order_custom_id
    };

    this.orders.push(newOrder);

    return newOrder;
  }

  async updateItems(newItems: OrderItems[], orderId: string): Promise<Order> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) throw new ResourceNotFoundError();

    this.orders[orderIndex].items = newItems as unknown as Prisma.JsonValue;
    return this.orders[orderIndex];
  }

  async openOrder(newItems: OrderItems[], orderId: string): Promise<Order> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) throw new ResourceNotFoundError();

    this.orders[orderIndex].items = newItems as unknown as Prisma.JsonValue;
    this.orders[orderIndex].status = 'InUse';
    return this.orders[orderIndex];
  }

  async cleanOrder(orderId: string): Promise<void> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) throw new ResourceNotFoundError();

    this.orders[orderIndex].items = [] as unknown as Prisma.JsonValue;
    this.orders[orderIndex].status = 'Available';
  }

  async updateOrderName(orderId: string, order_custom_id: string): Promise<Order> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) throw new ResourceNotFoundError();

    this.orders[orderIndex].order_custom_id = order_custom_id;

    return this.orders[orderIndex];
  }

  async delete(orderId: string): Promise<void> {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) throw new ResourceNotFoundError();

    this.orders.splice(orderIndex, 1);
  }
}
