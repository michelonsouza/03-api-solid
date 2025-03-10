import type { FastifyReply, FastifyRequest } from 'fastify';

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-usere-profile-use-case';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();

  const { data } = await getUserProfile.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ data });
}
