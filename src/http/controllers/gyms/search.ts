import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-repository';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1).optional(),
  });

  const { page, q } = searchGymsQuerySchema.parse(request.query);

  const searchGymsUsecase = makeSearchGymsUseCase();

  const response = await searchGymsUsecase.execute({
    query: q,
    page,
  });

  return reply.status(200).send(response);
}
