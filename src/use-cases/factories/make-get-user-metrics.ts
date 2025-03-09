import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

import { GetUserMetricsUseCase } from '../get-user-metrics';

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const userMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

  return userMetricsUseCase;
}
