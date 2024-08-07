import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemorUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileService } from './get-user-profile'

describe('Get user profile Service', () => {
  let sut: GetUserProfileService
  let usersRepository: InMemorUsersRepository
  beforeEach(async () => {
    usersRepository = new InMemorUsersRepository()
    sut = new GetUserProfileService(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password_hash: await hash('johndoe.password', 6),
      role: 'ADMIN'
    })
  })

  it('should be able to get user profile', async () => {
    const { user } = await sut.execute({ userId: 'user-0' })

    expect(user?.id).toEqual(expect.any(String))
  })

  it('should not be able to get user profile with wrong id', async () => {
    const { user } = await sut.execute({ userId: 'wrong-user-id' })

    expect(user).toBeNull()
  })
})