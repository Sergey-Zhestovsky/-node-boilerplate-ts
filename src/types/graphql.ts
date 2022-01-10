import { GraphQLSchema } from 'graphql';

export type TDirectiveTransformer = (
  schema: GraphQLSchema,
  directiveName?: string
) => GraphQLSchema;
