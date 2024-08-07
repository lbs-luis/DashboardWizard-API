import { StoresRepository } from "@/repositories/stores/stores-repository"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { GetAllManagerStoresService } from "@/services/get-stores/get-all-manager-stores"
import { GetAllUserStoresService } from "@/services/get-stores/get-all-user-stores"
import { FastifyRequest, FastifyReply } from "fastify"

export async function stores(request: FastifyRequest, response: FastifyReply) {

  try {
    const { role } = request.user
    const storesRepository = new StoresRepository()
    if (role === 'ADMIN') {
      const getAllManagerStoresService = new GetAllManagerStoresService(storesRepository)
      const { stores } = await getAllManagerStoresService.execute({ manager_id: request.user.sub })
      response.status(200).send({ stores })
    }
    if (role === 'OPERATOR') {
      const getAllOperatorStoresService = new GetAllUserStoresService(storesRepository)
      const { stores } = await getAllOperatorStoresService.execute({ userId: request.user.sub })
      response.status(200).send({ stores })
    }
  } catch (err) {
    if (err instanceof ResourceNotFoundError || err instanceof InvalidCredentialsError) {
      return response.status(500).send({ error: err.message })
    }
    throw err
  }
}