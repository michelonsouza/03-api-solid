import { differenceInMinutes, parseISO } from 'date-fns';

import {
  CheckIn,
  CheckInsRepository,
} from '@/repositories/check-ins-repository';

import { LateCheckInValidationErrorError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found';

interface ValidateCheckInsUseCaseParams {
  checkInId: string;
}

interface ValidateCheckInsUseCaseResponse {
  data: CheckIn;
}

export class ValidateCheckInsUseCase {
  #checkInsRepository: CheckInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.#checkInsRepository = checkInsRepository;
  }

  async execute({
    checkInId,
  }: ValidateCheckInsUseCaseParams): Promise<ValidateCheckInsUseCaseResponse> {
    const checkIn = await this.#checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError('Check-in');
    }

    const distanceInMinutesFromCheckInCreation = differenceInMinutes(
      new Date(),
      checkIn.created_at instanceof Date
        ? checkIn.created_at
        : parseISO(checkIn.created_at),
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationErrorError();
    }

    checkIn.validated_at = new Date();

    const updatedCheckIn = await this.#checkInsRepository.save(checkIn);

    return { data: updatedCheckIn };
  }
}
