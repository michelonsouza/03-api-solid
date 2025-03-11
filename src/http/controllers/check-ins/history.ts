import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const fetchUserCheckInsHistorySchema = z.object({
    page: z.coerce.number().min(1).default(1).optional(),
  });

  const { page } = fetchUserCheckInsHistorySchema.parse(request.query);

  const searchGymsUsecase = makeFetchUserCheckInsHistoryUseCase();

  const response = await searchGymsUsecase.execute({
    page,
    userId: request.user.sub,
  });

  return reply.status(200).send(response);
}
