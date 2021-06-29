import { SchemaDirectiveVisitor } from 'apollo-server';
import { defaultFieldResolver, GraphQLField } from 'graphql';
import { Client401Error } from '../../../../libs/ClientError';

class AuthorizedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<unknown, { user: unknown }>) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function (root, args, ctx, info) {
      if (!ctx.user) throw new Client401Error();
      return resolve.call(this, root, args, ctx, info) as unknown;
    };
  }
}

export = {
  authorized: AuthorizedDirective,
};
