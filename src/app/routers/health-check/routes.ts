import { Router as expressRouter } from 'express';

import { validateQuery } from '@/middleware';
import { RequestHandler } from '@/types/express';
import { pingController, healthController } from './controllers';
import { HealthCheckDto, PingDto } from './dto';

const router = expressRouter();

router.get('/', validateQuery(HealthCheckDto), (async ({ query }, res) => {
  const result = healthController(query);
  return res.status(200).return(result);
}) as RequestHandler<unknown, HealthCheckDto>);

router.get('/ping', validateQuery(PingDto), (async ({ query }, res) => {
  const result = pingController(query);
  return res.status(200).return(result);
}) as RequestHandler<unknown, PingDto>);

export default expressRouter().use('/health-check', router);
