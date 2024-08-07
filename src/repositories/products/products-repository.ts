import { prisma } from "@/lib/prisma";
import { IProductRepository, ProductUncheckedCreateInput } from "./IProductsRepository";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { ProductAlreadyExistsError } from "@/services/errors/product-already-exists-error";


export class ProductsRepository implements IProductRepository {
  async getAllProducts(storeId: string) {
    const thatStoreExists = await prisma.store.findUnique({
      where: {
        id: storeId,
      }
    })
    if (!thatStoreExists) { throw new ResourceNotFoundError() }
    const products = await prisma.product.findMany({
      where: {
        store: {
          id: storeId,
        }
      }
    })
    return products
  }

  async create({ description, bar_code, name, product_custom_id, store_id, quantity, price }: ProductUncheckedCreateInput,) {
    const storeWithSameCustomId = await prisma.store.findUnique({
      where: {
        id: store_id
      }
    })
    if (!storeWithSameCustomId) throw new ResourceNotFoundError()
    const productsWithSameCustomId = await prisma.product.findMany({
      where: {
        product_custom_id
      }
    })
    const hasDuplicatedProducts = productsWithSameCustomId.some((product) => product.store_id === store_id)
    if (hasDuplicatedProducts) throw new ProductAlreadyExistsError()

    const product = await prisma.product.create({
      data: {
        price_in_cents: Math.round(price * 100),
        description,
        name,
        product_custom_id,
        bar_code,
        store_id,
        quantity: quantity || 0
      }
    })

    return product
  }

  async delete(product_custom_id: string) {
    const product = await prisma.product.findFirst({
      where: {
        product_custom_id,
      }
    })
    if (!product) throw new ResourceNotFoundError()

    await prisma.product.delete({
      where: {
        id: product.id
      }
    })
  }
}