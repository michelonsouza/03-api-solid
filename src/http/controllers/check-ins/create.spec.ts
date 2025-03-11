import supertest from 'supertest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';
import { createAndSearchGym } from '@/utils/tests/create-and-search-gym';

describe('E2E: Create Check-in', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const { gym, latitude, longitude } = await createAndSearchGym(app, token);

    const data = {
      latitude,
      longitude,
    };

    const response = await supertest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    expect(response.statusCode).toEqual(201);
  });

  it('should not be able to create far from gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const { gym, latitude, longitude } = await createAndSearchGym(app, token);

    const data = {
      latitude: latitude + 2,
      longitude: longitude + 2,
    };

    const response = await supertest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    expect(response.statusCode).toEqual(409);
  });

  it('should be able to create a check-in in same day', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    const { gym, latitude, longitude } = await createAndSearchGym(app, token);

    const data = {
      latitude,
      longitude,
    };

    await supertest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    const response = await supertest(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    expect(response.statusCode).toEqual(409);
  });
});
