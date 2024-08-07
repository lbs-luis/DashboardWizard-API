import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { RegisterUsersService } from "@/services/register-users/register-users"
import { UsersRepository } from "@/repositories/users/users-repository"
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error"
import { RegisterStoresService } from "@/services/register-stores/register-stores"
import { StoresRepository } from "@/repositories/stores/stores-repository"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { StoreAlreadyExistsError } from "@/services/errors/store-already-exists-error"
import { GetStoreService } from "@/services/get-stores/get-store"



export async function signUpStore(request: FastifyRequest, response: FastifyReply) {
  const registBodySchema = z.object({
    storeName: z.string(),
    storeDescription: z.string(),
    storeCustomId: z.string().regex(/^[a-zA-Z0-9-_]+$/),
    managerName: z.string(),
    managerEmail: z.string().email(),
    managerPassword: z.string().min(6),
  })
  const { managerEmail, managerName, managerPassword, storeCustomId, storeDescription, storeName } = registBodySchema.parse(request.body)

  try {

    const registerUserService = new RegisterUsersService(new UsersRepository())
    const storesRepository = new StoresRepository()
    const registerStoreService = new RegisterStoresService(storesRepository)
    const getStoreService = new GetStoreService(storesRepository)

    const { store: storeWithSameId } = await getStoreService.execute({ store_custom_id: storeCustomId })
    if (storeWithSameId) throw new StoreAlreadyExistsError()

    const { user } = await registerUserService.execute({ name: managerName, email: managerEmail, password: managerPassword, role: 'ADMIN' })
    const { store } = await registerStoreService.execute({ name: storeName, description: storeDescription, store_custom_id: storeCustomId, manager_id: user.id })

    return response.status(201).send({ user, store })

  } catch (err) {
    if (err instanceof UserAlreadyExistsError || err instanceof ResourceNotFoundError || err instanceof StoreAlreadyExistsError) {
      return response.status(400).send({ error: err.message })
    }

    throw err
  }
}