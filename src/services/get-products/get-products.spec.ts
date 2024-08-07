import { expect, describe, it, beforeEach } from 'vitest';
import { GetProductsService } from './get-products';
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository';
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error';

describe('Get Products Service', () => {
  let sut: GetProductsService;
  let inMemoryProductsRepository: InMemoryProductsRepository;

  beforeEach(async () => {
    inMemoryProductsRepository = new InMemoryProductsRepository();
    sut = new GetProductsService(inMemoryProductsRepository);

    await inMemoryProductsRepository.create({
      bar_code: '000',
      description: 'prod-desc',
      name: 'prod-test-0',
      product_custom_id: 'CUSTOM-TAG',
      store_id: 'store-0',
      quantity: 100,
      price: 100
    },);
  });

  it('should be able to get all products from a store', async () => {
    const { products } = await sut.execute({ storeId: 'store-0' });

    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('prod-test-0');
  });

  it('should not be able to get products from a non-existing store', async () => {
    await expect(sut.execute({ storeId: 'wrong-store-id' }))
      .rejects
      .toBeInstanceOf(ResourceNotFoundError);
  });
});
