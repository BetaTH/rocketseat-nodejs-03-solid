import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  private checkInRepository: CheckInsRepository
  constructor(checkInRepository: CheckInsRepository) {
    this.checkInRepository = checkInRepository
  }

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    console.log(checkInId)
    const checkIn = await this.checkInRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }
    const validated_at = new Date()
    const distanceInMinutesFromCheckInCreation = dayjs(validated_at).diff(
      checkIn.created_at,
      'minutes',
    )
    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = validated_at

    await this.checkInRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
