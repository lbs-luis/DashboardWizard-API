import { expect, describe, it, beforeEach } from 'vitest';
import { OpenOrderService } from './open-order'; // ajuste o caminho conforme necessário
import { ResourceNotFoundError } from '../errors/resource-not-found-error'; // ajuste o caminho conforme necessário
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository';
import { OrderItems } from '@/repositories/orders/IOrdersRepository';

describe('Open Order Service', () => {
  let sut: OpenOrderService;
  let inMemoryOrdersRepository: InMemoryOrdersRepository;

  beforeEach(async () => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new OpenOrderService(inMemoryOrdersRepository);
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

  it('should be able to open an existing order and update its items and status', async () => {
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
    expect(order.status).toBe('InUse');
  });

  it('should not be able to open a non-existent order', async () => {
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
