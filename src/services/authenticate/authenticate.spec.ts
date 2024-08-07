import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { AuthenticateService } from './authenticate'
import { InMemorUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

describe('Authenticate Service', async () => {
  let usersRepository: InMemorUsersRepository
  let sut: AuthenticateService

  beforeEach(async () => {
    usersRepository = new InMemorUsersRepository()
    sut = new AuthenticateService(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password_hash: await hash('johndoe.password', 6),
    })
  })

  it('should be able to authenticate', async () => {
    const { user } = await sut.execute({
      email: 'john.doe@gmail.com',
      password: 'johndoe.password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const sut = new AuthenticateService(usersRepository)

    expect(() => sut.execute({
      email: 'wrong@gmail.com',
      password: 'johndoe.password',
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const sut = new AuthenticateService(usersRepository)

    expect(() => sut.execute({
      email: 'john.doe@gmail.com',
      password: 'wrong.password',
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})