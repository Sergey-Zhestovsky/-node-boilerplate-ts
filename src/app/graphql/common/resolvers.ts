import { GraphQLScalarType, Kind } from 'graphql';

export const Dictionary = new GraphQLScalarType<Record<string, unknown> | null, string | null>({
  name: 'Dictionary',
  description: 'Dictionary with string keys and any values',
  serialize(value) {
    return value as string | null;
  },
  parseValue(value) {
    return value as Record<string, unknown>;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value) as Record<string, unknown>;
      } catch {
        return null;
      }
    }

    return null;
  },
});
