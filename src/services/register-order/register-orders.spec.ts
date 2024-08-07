import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterOrdersService } from './register-orders';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository';
import { OrderItems } from '@/repositories/orders/IOrdersRepository';

describe('Register Order Service', () => {
  let sut: RegisterOrdersService;
  let inMemoryOrdersRepository: InMemoryOrdersRepository;

  beforeEach(async () => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new RegisterOrdersService(inMemoryOrdersRepository);
    inMemoryOrdersRepository['stores'].push({ id: 'store-0' });
  });

  it('should be able to register a new order', async () => {
    const items: OrderItems[] = [
      {
        id: 'item-1',
        name: 'Item 1',
        description: 'Description for item 1',
        quantity: 2,
        price_in_cents: 1000
      }
    ];

    const { order } = await sut.execute({
      type: 'Intern',
      items,
      store_id: 'store-0',
      status: 'Available',
      order_custom_id: 'order_custom_id',
    });

    expect(order.id).toEqual(expect.any(String));
  });

  it('should not be able to register with wrong store id', async () => {
    const items: OrderItems[] = [
      {
        id: 'item-1',
        name: 'Item 1',
        description: 'Description for item 1',
        quantity: 2,
        price_in_cents: 1000
      }
    ];

    await expect(
      sut.execute({
        type: 'Intern',
        items,
        store_id: 'WRONG-STORE-ID',
        status: 'Available',
        order_custom_id: 'order_custom_id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
