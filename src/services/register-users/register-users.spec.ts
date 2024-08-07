import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUsersService } from './register-users'
import { compare } from 'bcryptjs'
import { InMemorUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

describe('Register Users Service', () => {
  let sut: RegisterUsersService
  beforeEach(() => {
    sut = new RegisterUsersService(new InMemorUsersRepository())
  })

  it('should be able to register a new user', async () => {

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: 'johndoe.password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register with same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: 'johndoe.password',
    })

    expect(() => sut.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: 'johndoe.password',
    })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: 'johndoe.password',
    })

    const isPasswordCorrectlyHashed = await compare('johndoe.password', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})