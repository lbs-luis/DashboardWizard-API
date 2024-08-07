import { expect, describe, it, beforeEach } from 'vitest';
import { GetStoreService } from './get-store';
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository';

describe('Get Stores Service', () => {
  let sut: GetStoreService;
  let inMemoryStoresService: InMemoryStoresRepository;

  beforeEach(async () => {
    inMemoryStoresService = new InMemoryStoresRepository();
    sut = new GetStoreService(inMemoryStoresService);

    // Adiciona usuários fictícios
    inMemoryStoresService.addUser('manager-0');
    inMemoryStoresService.addUser('manager-1');
    inMemoryStoresService.addUser('user-0');

    // Adiciona lojas
    await inMemoryStoresService.create({
      name: 'store-0',
      description: 'Store-0',
      manager_id: 'manager-0',
      store_custom_id: 'Store-0'
    });

    await inMemoryStoresService.create({
      name: 'store-1',
      description: 'Store-1',
      manager_id: 'manager-1',
      store_custom_id: 'Store-1'
    });

    // Adiciona operadores à loja
    const store = await inMemoryStoresService.findByCustomId('Store-1');
    if (store) {
      store.operators.push({ id: 'user-0' });
    }
  });

  it('should be able to find a store by its custom ID', async () => {
    const { store } = await sut.execute({ store_custom_id: 'Store-0' });
    expect(store?.id).toEqual(expect.any(String));
    expect(store?.name).toBe('store-0');
  });

  it('should not be able to bring a store with a wrong custom id', async () => {
    const { store } = await sut.execute({ store_custom_id: 'wrong-custom-id' });
    expect(store).toBeNull();
  });

  it('should be able to find all stores managed by a specific manager', async () => {
    const stores = await inMemoryStoresService.findAllManagerStores('manager-0');
    expect(stores).toHaveLength(1);
    expect(stores[0].name).toBe('store-0');
  });

  it('should be able to find all stores where a specific user is an operator', async () => {
    const stores = await inMemoryStoresService.findAllUserStores('user-0');
    expect(stores).toHaveLength(1);
    expect(stores[0].name).toBe('store-1');
  });
});
