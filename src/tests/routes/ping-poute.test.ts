import request from 'supertest';

import app from '@/express';

const BASE_PATH = '/api/v1';

describe('Route /health-check', function () {
  describe('/ [GET]', function () {
    const url = `${BASE_PATH}/health-check`;

    test('simple request', async () => {
      const { status } = await request(app).get(url).send();
      expect(status).toBe(200);
    });

    test('responds with env', async () => {
      const { body, status } = await request(app).get(url).query({ withEnv: true });

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          result: expect.objectContaining({
            environment: expect.anything(),
          }),
        })
      );
    });
  });

  describe('/ping [POST]', function () {
    const url = `${BASE_PATH}/health-check/ping`;

    test('simple request', async () => {
      const { body, status } = await request(app).get(url).query({ withTime: false });

      expect(status).toBe(200);
      expect((body as ServerResponse<string>).result).toBe('pong');
    });

    test('with valid body', async () => {
      const { body, status } = await request(app).get(url).query({ withTime: true });

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          result: expect.objectContaining({
            timeStamp: expect.anything(),
          }),
        })
      );
    });
  });
});
