import { ProductsRepository } from "@/repositories/products/products-repository"
import { ProductAlreadyExistsError } from "@/services/errors/product-already-exists-error"
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error"
import { RegisterProductsService } from "@/services/register-product/register-products"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function registerProduct(request: FastifyRequest, response: FastifyReply) {
  try {
    const registBodySchema = z.object({
      product_custom_id: z.string().regex(/^[a-zA-Z0-9-_]+$/),
      productBarCode: z
        .string()
        .regex(/^\d*$/)
        .optional(),
      productName: z.string(),
      productDescription: z.string().optional(),
      productQuantity: z.number(),
      productPrice: z.number(),
      storeId: z.string(),
    })

    const { productBarCode, productName, productQuantity, product_custom_id, productDescription, storeId, productPrice } = registBodySchema.parse(request.body)
    const registerProductsService = new RegisterProductsService(new ProductsRepository())
    const { product } = await registerProductsService.execute({ price: productPrice, bar_code: productBarCode || "", product_custom_id, description: productDescription || '', name: productName, store_id: storeId, quantity: productQuantity })

    response.status(200).send({ product })
  } catch (err) {
    if (err instanceof ProductAlreadyExistsError || err instanceof ResourceNotFoundError) { response.status(500).send({ error: err.message }) }
    throw err
  }
}