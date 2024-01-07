import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

export type FetchNearbyGymsUseCaseResponse = {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  private gymsRepository: GymsRepository
  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
