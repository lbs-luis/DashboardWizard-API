import { Product } from "@prisma/client"
import { IProductRepository } from "@/repositories/products/IProductsRepository"

interface IServiceRequest {
  storeId: string
}
interface IServiceResponse {
  products: {
    id: string;
    product_custom_id: string;
    bar_code: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
    store_id: string;
  }[]
}

export class GetProductsService {
  constructor(private productsRepository: IProductRepository) { }

  async execute({ storeId }: IServiceRequest): Promise<IServiceResponse> {
    const data = await this.productsRepository.getAllProducts(storeId)
    const products = data.map((product) => {
      const { bar_code, created_at, description, id, name, price_in_cents, product_custom_id, quantity, store_id, updated_at } = product
      return ({
        id,
        product_custom_id,
        bar_code,
        name,
        description,
        price: price_in_cents / 100,
        quantity,
        created_at,
        updated_at,
        store_id,
      })
    })

    return {
      products
    }
  }
}