import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

export type SearchGymsUseCaseResponse = {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  private gymsRepository: GymsRepository
  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
