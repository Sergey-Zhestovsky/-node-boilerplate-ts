const request = require('supertest');

const app = require('../../express');

const BASE_PATH = '/api/v1';

describe('Route /health-check', function () {
  describe('/ [GET]', function () {
    test('simple request', async () => {
      const { status } = await request(app).get(`${BASE_PATH}/health-check`).query();

      expect(status).toBe(200);
    });

    test('responds with env', async () => {
      const { body, status } = await request(app)
        .get(`${BASE_PATH}/health-check`)
        .query({ withEnv: true });

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
    test('simple request', async () => {
      const { body, status } = await request(app)
        .get(`${BASE_PATH}/health-check/ping`)
        .query({ withTime: false });

      expect(status).toBe(200);
      expect(body.result).toBe('pong');
    });

    test('with valid body', async () => {
      const { body, status } = await request(app)
        .get(`${BASE_PATH}/health-check/ping`)
        .query({ withTime: true });

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
