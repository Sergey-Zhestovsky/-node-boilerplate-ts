import Joi from 'joi';

import { QueryDto } from '@/core/models/Dto';

export class HealthCheckDto extends QueryDto {
  static validator(T: Joi.Root) {
    return {
      withEnv: T.boolean().optional(),
    };
  }

  public withEnv: boolean;

  constructor({ withEnv = false }) {
    super();

    this.withEnv = withEnv;
  }
}

export class PingDto extends QueryDto {
  static validator(T: Joi.Root) {
    return {
      withTime: T.boolean().optional(),
    };
  }

  public withTime: boolean;

  constructor({ withTime = false }) {
    super();

    this.withTime = withTime;
  }
}
