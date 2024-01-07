import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Thielson',
      email: 'thielson@gmail.com',
      password: '1234156489',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Thielson',
      email: 'thielson@gmail.com',
      password: '1234156489',
    })

    const isPasswordCorrectlyHashed = await compare(
      '1234156489',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'thielson@gmail.com'

    await sut.execute({
      name: 'Thielson',
      email,
      password: '1234156489',
    })

    await expect(() =>
      sut.execute({
        name: 'Thielson',
        email,
        password: '1234156489',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
