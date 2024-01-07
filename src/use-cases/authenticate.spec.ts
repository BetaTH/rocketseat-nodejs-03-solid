import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Thielson',
      email: 'thielson@gmail.com',
      password_hash: await hash('1234156489', 6),
    })

    const { user } = await sut.execute({
      email: 'thielson@gmail.com',
      password: '1234156489',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'thielson@gmail.com',
        password: '1234156489',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Thielson',
      email: 'thielson@gmail.com',
      password_hash: await hash('1234156489', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'thielson@gmail.com',
        password: '1236489',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
