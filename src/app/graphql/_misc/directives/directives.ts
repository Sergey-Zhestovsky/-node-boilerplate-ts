import { GraphQLFieldConfig, GraphQLSchema, defaultFieldResolver } from 'graphql';
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils';

import { Client401Error } from '@/libs/server-responses';

export const authorizedDirectiveTransformer = (
  schema: GraphQLSchema,
  directiveName = 'authorized'
) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig: GraphQLFieldConfig<unknown, { user: unknown }>) => {
      const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (upperDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (root, args, ctx, info) {
          if (!ctx.user) throw new Client401Error();
          return resolve.call(this, root, args, ctx, info);
        };
      }

      return fieldConfig;
    },
  });
};
