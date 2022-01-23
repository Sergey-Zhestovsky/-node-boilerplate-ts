import { Contract } from '@/core/models/Contract';
import { Swagger } from '@/libs/swagger';
import { IProcessEnv } from '@/libs/config';

Swagger.setSchema('HealthCheckContract', {
  type: 'object',
  properties: {
    status: {
      type: 'string',
    },
    started: {
      type: 'boolean',
    },
    environment: {
      type: 'object',
      nullable: true,
      additionalProperties: {
        type: 'string',
      },
    },
  },
});

export class HealthCheckContract extends Contract {
  static fromObject(data: Omit<HealthCheckContract, 'toResponse'>) {
    return new HealthCheckContract(data.status, data.started, data.environment);
  }

  constructor(public status: string, public started: boolean, public environment?: IProcessEnv) {
    super();
  }
}

Swagger.setSchema('PingContract', {
  oneOf: [
    {
      type: 'object',
      properties: {
        timeStamp: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    {
      type: 'string',
      default: 'pong',
    },
  ],
});
