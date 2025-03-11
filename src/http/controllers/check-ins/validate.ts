import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { LateCheckInValidationErrorError } from '@/use-cases/errors/late-check-in-validation-error';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const createGymuseCase = makeValidateCheckInUseCase();

  try {
    await createGymuseCase.execute({
      checkInId,
    });
  } catch (error) {
    if (error instanceof LateCheckInValidationErrorError) {
      return reply.status(error.code).send({
        message: error.message,
      });
      /* v8 ignore next 4 */
    }

    throw error as Error;
  }

  return reply.status(204).send();
}
