import type { FastifyInstance } from 'fastify';

import { authenticate } from './controllers/authenticate';
import { register } from './controllers/register';

export async function appRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate);

  app.post('/users', register);
}
