import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterProductsService } from './register-products'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'

describe('Register Products Service', () => {
  let sut: RegisterProductsService
  let inMemoryProductsService: InMemoryProductsRepository
  beforeEach(async () => {
    inMemoryProductsService = new InMemoryProductsRepository()
    sut = new RegisterProductsService(inMemoryProductsService)

    await inMemoryProductsService.create({
      bar_code: '000',
      description: 'prod-desc',
      name: 'prod-test-0',
      product_custom_id: 'CUSTOM-TAG',
      store_id: 'store-0',
      quantity: 100,
      price: 100,
    })
  })

  it('should be able to register a new product', async () => {
    const { product } = await sut.execute({
      bar_code: '111000',
      description: 'product-1',
      name: 'Product 1',
      product_custom_id: 'PRODUCT-TAG',
      store_id: 'store-0',
      quantity: 100,
      price_in_cents: 100
    })

    expect(product.id).toEqual(expect.any(String))
  })

  it('should not be able to register with wrong store id', async () => {

    expect(() => sut.execute({
      bar_code: '111000',
      description: 'product-1',
      name: 'Product 1',
      product_custom_id: 'PRODUCT-TAG',
      store_id: 'WRONG-STORE-ID',
      quantity: 100,
      price_in_cents: 100
    })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})