import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Thielson Gym',
        description: 'Description here',
        phone: '1111555555',
        latitude: -5.0274379,
        longitude: -42.8143813,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Jhon Doe Gym',
        description: 'Description here',
        phone: '1111555555',
        latitude: -5.0376664,
        longitude: -42.4551688,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: -5.0274379, longitude: -42.8143813 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Thielson Gym' }),
    ])
  })
})
