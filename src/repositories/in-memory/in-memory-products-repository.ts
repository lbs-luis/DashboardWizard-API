import { Prisma, Product } from "@prisma/client";
import { IProductRepository, ProductUncheckedCreateInput } from "@/repositories/products/IProductsRepository";
import { ResourceNotFoundError } from "@/services/errors/resource-not-found-error";
import { ProductAlreadyExistsError } from "@/services/errors/product-already-exists-error";

export class InMemoryProductsRepository implements IProductRepository {
  private products: Product[] = [];
  private stores: { id: string }[] = [{ id: 'store-0' }]; // Mock de lojas

  async getAllProducts(store_id: string): Promise<Product[]> {
    const storeExists = this.stores.some(store => store.id === store_id);
    if (!storeExists) throw new ResourceNotFoundError();

    return this.products.filter(product => product.store_id === store_id);
  }

  async create({
    description,
    bar_code,
    name,
    product_custom_id,
    store_id,
    quantity,
    price
  }: ProductUncheckedCreateInput): Promise<Product> {
    const storeExists = this.stores.some(store => store.id === store_id);
    if (!storeExists) throw new ResourceNotFoundError();

    const productExists = this.products.some(product => product.product_custom_id === product_custom_id);
    if (productExists) throw new ProductAlreadyExistsError();

    const newProduct: Product = {
      id: `product-${this.products.length}`,
      description,
      bar_code,
      name,
      product_custom_id,
      store_id,
      quantity: quantity || 0,
      created_at: new Date(),
      updated_at: new Date(),
      price_in_cents: Math.round(price * 100)
    };

    this.products.push(newProduct);

    return newProduct;
  }

  async delete(product_custom_id: string): Promise<void> {
    const productIndex = this.products.findIndex(product => product.product_custom_id === product_custom_id);
    if (productIndex === -1) throw new ResourceNotFoundError();

    this.products.splice(productIndex, 1);
  }
}
