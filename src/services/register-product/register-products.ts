import { Product } from "@prisma/client"
import { IProductRepository, ProductUncheckedCreateInput } from "@/repositories/products/IProductsRepository"

interface IServiceRequest extends ProductUncheckedCreateInput {
}
interface IServiceResponse {
  product: Product
}

export class RegisterProductsService {
  constructor(private productsRepository: IProductRepository) { }

  async execute({ bar_code, description, name, product_custom_id, store_id, quantity, price }: IServiceRequest): Promise<IServiceResponse> {
    const product = await this.productsRepository.create({
      bar_code,
      description,
      name,
      product_custom_id,
      store_id,
      quantity,
      price
    })

    return {
      product
    }
  }
}