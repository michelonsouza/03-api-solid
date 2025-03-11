import type { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';

import { authenticate } from './authenticate';
import { profile } from './profile';
import { refresh } from './refresh';
import { register } from './register';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate);
  app.post('/users', register);

  app.patch('/token/refresh', refresh);

  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
