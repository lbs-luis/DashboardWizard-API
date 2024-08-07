import { IProductRepository } from "@/repositories/products/IProductsRepository"

interface IServiceRequest {
  product_custom_id: string
}

export class ProductsService {
  constructor(private productsRepository: IProductRepository) { }

  async delete({ product_custom_id }: IServiceRequest): Promise<void> {
    await this.productsRepository.delete(product_custom_id)
  }
}