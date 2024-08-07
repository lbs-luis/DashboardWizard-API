import { Prisma, Store } from "@prisma/client";
import { IStoresRepository } from "@/repositories/stores/IStoresRepository";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { StoreAlreadyExistsError } from "@/services/errors/store-already-exists-error";

interface StoreWithOperators extends Store {
  operators: { id: string }[];
}

export class InMemoryStoresRepository implements IStoresRepository {
  private stores: StoreWithOperators[] = [];
  private users: { id: string }[] = []; // Simula os usuários

  async findByCustomId(store_custom_id: string) {
    const store = this.stores.find(store => store.store_custom_id === store_custom_id);
    return store || null;
  }

  async findAllManagerStores(manager_id: string) {
    return this.stores.filter(store => store.manager_id === manager_id);
  }

  async findAllUserStores(userId: string) {
    return this.stores.filter(store => store.operators.some(op => op.id === userId));
  }

  async create({ description, manager_id, name, store_custom_id }: Prisma.StoreUncheckedCreateInput) {
    // Verifica se o usuário (manager) existe
    const userExists = this.users.some(user => user.id === manager_id);
    if (!userExists) throw new ResourceNotFoundError();

    // Verifica se a loja já existe com o mesmo ID personalizado
    const storeExists = this.stores.some(store => store.store_custom_id === store_custom_id);
    if (storeExists) throw new StoreAlreadyExistsError();

    // Cria a nova loja
    const newStore: StoreWithOperators = {
      id: `store-${this.stores.length}`, // Gera um ID fictício
      store_custom_id,
      name,
      description,
      manager_id,
      created_at: new Date(),
      updated_at: new Date(),
      operators: [] // Inicializa a lista de operadores vazia
    };

    this.stores.push(newStore);
    return newStore;
  }

  // Adiciona usuários fictícios para testar o repositório
  addUser(id: string) {
    this.users.push({ id });
  }
}
