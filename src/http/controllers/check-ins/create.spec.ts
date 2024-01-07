import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in ', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Thielson Gym',
        description: 'Description here',
        phone: '1111555555',
        latitude: -5.0274379,
        longitude: -42.8143813,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -5.0274379,
        longitude: -42.8143813,
      })

    expect(response.statusCode).toEqual(201)
  })
})
