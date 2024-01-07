import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const newUser = await usersRepository.create({
      name: 'Thielson',
      email: 'thielson@gmail.com',
      password_hash: await hash('1234156489', 6),
    })

    const { user } = await sut.execute({
      userId: newUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'wrong-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
