import { ProductsRepository } from "@/repositories/products/products-repository"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { GetProductsService } from "@/services/get-products/get-products"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getProducts(request: FastifyRequest, response: FastifyReply) {
  try {
    const registBodySchema = z.object({
      storeId: z.string(),
    })
    const { storeId } = registBodySchema.parse(request.body)
    const getProductsService = new GetProductsService(new ProductsRepository())
    const { products } = await getProductsService.execute({ storeId })

    response.status(200).send({ products })
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof ResourceNotFoundError) { response.status(500).send({ error: err.message }) }
    throw err
  }
}