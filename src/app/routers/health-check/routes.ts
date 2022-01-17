import { getRouter } from '@/core/express';
import { Swagger } from '@/libs/swagger';
import { validateQuery } from '@/middleware';
import { pingController, healthController } from './controllers';
import { HealthCheckDto, PingDto } from './dto';
import { HealthCheckContract } from './contracts';

Swagger.setTag('health-check');
const router = getRouter('/health-check');

Swagger.setEndpoint('get', '/health-check/', {
  operationId: 'getHealthCheckStatus',
  tags: ['health-check'],
  summary: 'Get information about server health',
  parameters: Swagger.getQuerySchema('HealthCheckDto'),
  responses: {
    200: Swagger.getResultResponse('HealthCheckContract', true),
  },
});

router.get<unknown, HealthCheckContract, unknown, HealthCheckDto>(
  '/',
  validateQuery(HealthCheckDto),
  async ({ query }, res) => {
    const result = healthController(query);
    return res.status(200).return(HealthCheckContract.fromObject(result));
  }
);

Swagger.setEndpoint('get', '/health-check/ping', {
  operationId: 'pingServer',
  tags: ['health-check'],
  summary: 'Ping the server',
  parameters: Swagger.getQuerySchema('PingDto'),
  responses: {
    200: Swagger.getResultResponse('PingContract', true),
  },
});

router.get<unknown, object | string, unknown, PingDto>(
  '/ping',
  validateQuery(PingDto),
  async ({ query }, res) => {
    const result = pingController(query);
    return res.status(200).return(result);
  }
);

export default router.build();
