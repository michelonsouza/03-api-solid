import supertest from 'supertest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';

describe('E2E: Profile', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    const { token, email, name } = await createAndAuthenticateUser(app);

    const profileResponse = await supertest(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.data).toEqual(
      expect.objectContaining({ email, name }),
    );
  });
});
