import { Prisma, Store, User } from "@prisma/client";

export interface IStoresRepository {
  findByCustomId(store_custom_id: string): Promise<Store | null>
  findAllManagerStores(manager_id: string): Promise<Store[]>
  findAllUserStores(userId: string): Promise<Store[]>

  create({ description, manager_id, name, store_custom_id }: Prisma.StoreUncheckedCreateInput): Promise<Store>
}