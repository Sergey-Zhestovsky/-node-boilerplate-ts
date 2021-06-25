const { Router: expressRouter } = require('express');
const { pingController, healthController } = require('./controllers');
const {
  validators: { validateQuery },
} = require('../../../middleware');
const { HealthCheckDto, PingDto } = require('./dto');

const router = expressRouter();

router.get('/', validateQuery(HealthCheckDto), async ({ query }, res) => {
  const result = healthController(query);
  return res.status(200).return(result);
});

router.get('/ping', validateQuery(PingDto), async ({ query }, res) => {
  const result = pingController(query);
  return res.status(200).return(result);
});

module.exports = expressRouter().use('/health-check', router);
