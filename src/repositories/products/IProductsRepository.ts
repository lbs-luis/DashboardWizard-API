import { Product } from "@prisma/client";

export interface ProductUncheckedCreateInput {
  product_custom_id: string;
  bar_code: string;
  name: string;
  description: string;
  price: number;
  store_id: string;
  quantity?: number;
}

export interface IProductRepository {
  getAllProducts(store_id: string): Promise<Product[]>

  create({ description, name, bar_code, product_custom_id, store_id, quantity, price }: ProductUncheckedCreateInput): Promise<Product>

  delete(product_custom_id: string): Promise<void>
}