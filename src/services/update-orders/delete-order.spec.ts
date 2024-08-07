import { expect, describe, it, beforeEach } from 'vitest';
import { DeleteOrderService } from './delete-order'; // ajuste o caminho conforme necessário
import { ResourceNotFoundError } from '../errors/resource-not-found-error'; // ajuste o caminho conforme necessário
import { InMemoryOrdersRepository } from '@/repositories/in-memory/in-memory-orders-repository';
import { OrderUncheckedCreateInput } from '@/repositories/orders/IOrdersRepository';

describe('Delete Order Service', () => {
  let sut: DeleteOrderService;
  let inMemoryOrdersRepository: InMemoryOrdersRepository;

  beforeEach(async () => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository();
    sut = new DeleteOrderService(inMemoryOrdersRepository);
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

  it('should be able to delete an existing order', async () => {
    const orderId = 'order-0';

    await sut.execute({ orderId });

    const orders = await inMemoryOrdersRepository.getAllOrders('Intern', 'store-0');
    expect(orders).toHaveLength(0); // Verifica se não há mais pedidos
  });

  it('should not be able to delete a non-existent order', async () => {
    const nonExistentOrderId = 'non-existent-order-id';

    await expect(
      sut.execute({ orderId: nonExistentOrderId })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
