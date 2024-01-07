import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(req: FastifyRequest, rep: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query)

  const searchGymsUseCase = makeFetchNearbyGymsUseCase()
  const { gyms } = await searchGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return rep.status(200).send({ gyms })
}
