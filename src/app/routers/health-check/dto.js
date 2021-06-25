const Joi = require('joi');

const { QueryDto } = require('../../../api/classes/Dto');

class HealthCheckDto extends QueryDto {
  constructor({ withEnv = false }) {
    super();

    this.withEnv = withEnv;
  }

  /** @param {Joi} T */
  static validator(T) {
    return {
      withEnv: T.boolean().optional(),
    };
  }
}

exports.HealthCheckDto = HealthCheckDto;

class PingDto extends QueryDto {
  constructor({ withTime = false }) {
    super();

    this.withTime = withTime;
  }

  /**
   * @param {Joi} T
   * @returns {Joi.Schema}
   */
  static validator(T) {
    return {
      withTime: T.boolean().optional(),
    };
  }
}

exports.PingDto = PingDto;
