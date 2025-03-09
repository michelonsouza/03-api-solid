import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

import { FetchUserCheckInsHystoryUseCase } from '../fetch-user-check-ins-history';

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHystoryUseCase(
    checkInsRepository,
  );

  return fetchUserCheckInsHistoryUseCase;
}
