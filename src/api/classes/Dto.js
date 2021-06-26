class Dto {
  static validator(Joi) {
    return [];
  }
}

class QueryDto extends Dto {}

class BodyDto extends Dto {}

module.exports = {
  Dto,
  QueryDto,
  BodyDto,
};
