import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists';
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(error.code).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send();
}
