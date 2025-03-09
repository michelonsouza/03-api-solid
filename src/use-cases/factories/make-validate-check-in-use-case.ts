import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

import { ValidateCheckInsUseCase } from '../validate-check-in';

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const validateCheckInUseCase = new ValidateCheckInsUseCase(
    checkInsRepository,
  );

  return validateCheckInUseCase;
}
