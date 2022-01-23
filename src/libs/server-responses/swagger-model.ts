import { Swagger } from '../swagger';

Swagger.setSchema('ClientError', {
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    status: {
      type: 'number',
    },
    message: {
      type: 'string',
      nullable: true,
    },
    descriptor: {
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
      nullable: true,
    },
    date: {
      type: 'string',
      format: 'date-time',
    },
  },
});
