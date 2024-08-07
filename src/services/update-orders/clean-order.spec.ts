import { expect, describe, it, beforeEach } from 'vitest';
import { CleanOrderService } from './clean-order'; // Atualize o caminho conforme a localização do seu arquivo
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository';
import { OrderItems } from '@/repositories/orders/IOrdersRepository';

describe('Clean Order Service', () => {
  let sut: CleanOrderService;
  let inMemoryOrdersRepository: InMemoryOrdersRepository;

  beforeEach(async () => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new CleanOrderService(inMemoryOrdersRepository);
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

  it('should be able to clean the items and reset the status of an existing order', async () => {
    const orderId = 'order-0';

    await sut.execute({ orderId });

    const updatedOrder = await inMemoryOrdersRepository.updateItems([], orderId);

    expect(updatedOrder.items).toEqual([]);
    expect(updatedOrder.status).toBe('Available');
  });

  it('should not be able to clean items for a non-existent order', async () => {
    const nonExistentOrderId = 'non-existent-order-id';

    await expect(
      sut.execute({ orderId: nonExistentOrderId })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
