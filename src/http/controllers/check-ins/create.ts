import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { MaxDistanceError } from '@/use-cases/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error';
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine(degree => Math.abs(degree) <= 90),
    longitude: z.number().refine(degree => Math.abs(degree) <= 180),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const createGymuseCase = makeCheckInUseCase();

  try {
    await createGymuseCase.execute({
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
      userId: request.user.sub,
    });
  } catch (error) {
    if (
      error instanceof MaxDistanceError ||
      error instanceof MaxNumberOfCheckInsError
    ) {
      return reply.status(error.code).send({
        message: error.message,
      });
      /* v8 ignore next 4 */
    }

    throw error as Error;
  }

  return reply.status(201).send();
}
