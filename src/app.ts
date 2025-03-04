import fastify from 'fastify';
import { ZodError } from 'zod';

import { env } from './env';
import { appRoutes } from './http/routes';

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler(async (error, _request, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // [ ] TODO: Here we could log the error to a service like Sentry/DataDog/NewRelic
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
