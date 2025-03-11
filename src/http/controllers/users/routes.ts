import type { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';

import { authenticate } from './authenticate';
import { profile } from './profile';
import { register } from './register';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate);
  app.post('/users', register);

  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
