import { ProductsRepository } from "@/repositories/products/products-repository"
import { ProductsService } from "@/services/products"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function deleteProduct(request: FastifyRequest, response: FastifyReply) {
  try {
    const registBodySchema = z.object({
      product_custom_id: z.string(),
    })
    const { product_custom_id } = registBodySchema.parse(request.body)
    const deleteProductService = new ProductsService(new ProductsRepository())
    await deleteProductService.delete({ product_custom_id })

    response.status(200).send({})
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof ResourceNotFoundError) { response.status(500).send({ error: err.message }) }
    throw err
  }
}