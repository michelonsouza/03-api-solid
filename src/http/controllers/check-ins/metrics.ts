import type { FastifyReply, FastifyRequest } from 'fastify';

import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsUsecase = makeGetUserMetricsUseCase();

  const response = await searchGymsUsecase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send(response);
}
