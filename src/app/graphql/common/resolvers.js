const { GraphQLScalarType, Kind } = require('graphql');

exports.Dictionary = new GraphQLScalarType({
  name: 'Dictionary',
  description: 'Dictionary with string keys and any values',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch (error) {
        return null;
      }
    }

    return null;
  },
});
