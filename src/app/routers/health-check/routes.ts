import { Router as expressRouter } from 'express';
import { RequestHandler } from 'express-serve-static-core';

import { validators } from '@/middleware';
import { pingController, healthController } from './controllers';
import { HealthCheckDto, PingDto } from './dto';

const { validateQuery } = validators;
const router = expressRouter();

router.get('/', validateQuery(HealthCheckDto), (async ({ query }, res) => {
  const result = healthController(query);
  return res.status(200).return(result);
}) as RequestHandler<unknown, unknown, unknown, HealthCheckDto>);

router.get('/ping', validateQuery(PingDto), (async ({ query }, res) => {
  const result = pingController(query);
  return res.status(200).return(result);
}) as RequestHandler<unknown, unknown, unknown, PingDto>);

export default expressRouter().use('/health-check', router);
