import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    latitude: z.number().refine(degree => Math.abs(degree) <= 90),
    longitude: z.number().refine(degree => Math.abs(degree) <= 180),
    phone: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  });

  const { latitude, longitude, title, description, phone } =
    createGymBodySchema.parse(request.body);

  const createGymuseCase = makeCreateGymUseCase();

  await createGymuseCase.execute({
    title,
    latitude,
    longitude,
    /* v8 ignore next 2 */
    phone: phone ?? null,
    description: description ?? null,
  });

  return reply.status(201).send();
}
