import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterStoresService } from './register-stores';
import { InMemoryStoresRepository } from '@/repositories/in-memory/in-memory-stores-repository';
import { StoreAlreadyExistsError } from '../errors/store-already-exists-error';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

describe('Register Stores Service', () => {
  let sut: RegisterStoresService;
  let inMemoryStoresService: InMemoryStoresRepository;

  beforeEach(async () => {
    inMemoryStoresService = new InMemoryStoresRepository();
    sut = new RegisterStoresService(inMemoryStoresService);

    // Adiciona um usuário fictício
    inMemoryStoresService.addUser('manager-0');
  });

  it('should be able to register a new store', async () => {
    const { store } = await sut.execute({
      name: 'store-1',
      description: 'Store-1',
      manager_id: 'manager-0',
      store_custom_id: 'Store-1'
    });

    expect(store.id).toEqual(expect.any(String));
    expect(store.name).toBe('store-1');
    expect(store.description).toBe('Store-1');
    expect(store.manager_id).toBe('manager-0');
    expect(store.store_custom_id).toBe('Store-1');
  });

  it('should not be able to register with the same store custom ID', async () => {
    await sut.execute({
      name: 'store-1',
      description: 'Store-1',
      manager_id: 'manager-0',
      store_custom_id: 'Store-1'
    });

    // Tenta registrar uma loja com o mesmo ID personalizado
    await expect(() => sut.execute({
      name: 'store-2',
      description: 'Store-2',
      manager_id: 'manager-0',
      store_custom_id: 'Store-1'
    })).rejects.toBeInstanceOf(StoreAlreadyExistsError);
  });

  it('should not be able to register with a wrong manager ID', async () => {
    // Tenta registrar uma loja com um ID de gerente inexistente
    await expect(() => sut.execute({
      name: 'store-2',
      description: 'Store-2',
      manager_id: 'wrong-manager',
      store_custom_id: 'Store-2'
    })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
