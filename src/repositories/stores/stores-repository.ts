import { prisma } from "@/lib/prisma";
import { IStoresRepository } from "./IStoresRepository";
import { Prisma } from "@prisma/client";
import { StoreAlreadyExistsError } from "@/services/errors/store-already-exists-error";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";


export class StoresRepository implements IStoresRepository {
  async findByCustomId(store_custom_id: string) {
    const store = await prisma.store.findUnique({
      where: {
        store_custom_id
      }
    })

    return store
  }

  async findAllManagerStores(manager_id: string) {
    const stores = await prisma.store.findMany({
      where: {
        manager_id
      }
    })
    return stores
  }

  async findAllUserStores(userId: string) {
    const stores = await prisma.store.findMany({
      where: {
        operators: {
          some: {
            id: userId
          }
        }
      }
    })
    return stores
  }

  async create({ description, manager_id, name, store_custom_id }: Prisma.StoreUncheckedCreateInput) {
    const storeWithSameCustomId = await prisma.store.findUnique({
      where: {
        store_custom_id
      }
    })
    if (storeWithSameCustomId) throw new StoreAlreadyExistsError()
    const userExists = await prisma.user.findUnique({
      where: {
        id: manager_id
      }
    })
    if (!userExists) throw new ResourceNotFoundError()

    const store = await prisma.store.create({
      data: {
        description,
        name,
        store_custom_id,
        manager_id
      }
    })

    return store
  }
}