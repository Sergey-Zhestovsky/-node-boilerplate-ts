import { GraphQLScalarType, Kind } from 'graphql';

export const Dictionary = new GraphQLScalarType({
  name: 'Dictionary',
  description: 'Dictionary with string keys and any values',
  serialize(value: Record<string, unknown>) {
    return value;
  },
  parseValue(value: Record<string, unknown>) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value) as Record<string, unknown>;
      } catch (error) {
        return null;
      }
    }

    return null;
  },
});
