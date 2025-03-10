import type { FastifyInstance } from 'fastify';

import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { register } from './controllers/register';
import { verifyJwt } from './middlewares/verify-jwt';

export async function appRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate);
  app.post('/users', register);

  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
