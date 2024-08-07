import { expect, describe, it, beforeEach } from 'vitest';
import { UpdateOrdersItemsService } from './update-order-items';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository';
import { OrderItems } from '@/repositories/orders/IOrdersRepository';

describe('Update Orders Service', () => {
  let sut: UpdateOrdersItemsService;
  let inMemoryOrdersRepository: InMemoryOrdersRepository;

  beforeEach(async () => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new UpdateOrdersItemsService(inMemoryOrdersRepository);
    inMemoryOrdersRepository['stores'].push({ id: 'store-0' });

    await inMemoryOrdersRepository.create({
      type: 'Intern',
      items: [
        {
          id: 'item-1',
          name: 'Item 1',
          description: 'Description for item 1',
          quantity: 2,
          price_in_cents: 1000
        }
      ],
      store_id: 'store-0',
      status: 'Available',
      order_custom_id: 'order_custom_id'
    });
  });

  it('should be able to update items in an existing order', async () => {
    const newItems: OrderItems[] = [
      {
        id: 'item-2',
        name: 'Item 2',
        description: 'Description for item 2',
        quantity: 5,
        price_in_cents: 2500
      }
    ];

    const orderId = 'order-0';
    const { order } = await sut.execute({
      newItems,
      orderId
    });

    expect(order.items).toEqual(newItems);
  });

  it('should not be able to update items for a non-existent order', async () => {
    const newItems: OrderItems[] = [
      {
        id: 'item-2',
        name: 'Item 2',
        description: 'Description for item 2',
        quantity: 5,
        price_in_cents: 2500
      }
    ];

    const nonExistentOrderId = 'non-existent-order-id';

    await expect(
      sut.execute({
        newItems,
        orderId: nonExistentOrderId
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
