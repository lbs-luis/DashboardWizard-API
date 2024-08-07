import { expect, describe, it, beforeEach } from 'vitest';
import { UpdateOrderNameService } from './update-order-name'; // Atualize o caminho conforme a localização do seu arquivo
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository';
import { OrderItems } from '@/repositories/orders/IOrdersRepository';

describe('Update Order Name Service', () => {
  let sut: UpdateOrderNameService;
  let inMemoryOrdersRepository: InMemoryOrdersRepository;

  beforeEach(async () => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new UpdateOrderNameService(inMemoryOrdersRepository);
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
      order_custom_id: 'old_custom_id'
    });
  });

  it('should be able to update the custom ID of an existing order', async () => {
    const newCustomId = 'new_custom_id';
    const orderId = 'order-0';

    await sut.execute({ orderId, order_custom_id: newCustomId });

    const order = await inMemoryOrdersRepository.updateOrderName(orderId, newCustomId);

    expect(order.order_custom_id).toBe(newCustomId);
  });

  it('should not be able to update the custom ID of a non-existent order', async () => {
    const newCustomId = 'new_custom_id';
    const nonExistentOrderId = 'non-existent-order-id';

    await expect(
      sut.execute({ orderId: nonExistentOrderId, order_custom_id: newCustomId })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
