const { SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');
const { Client401Error } = require('../../../../libs/ClientError');

class AuthorizedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, type) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function (root, args, ctx, info) {
      if (!ctx.user) throw new Client401Error();
      return resolve.call(this, root, args, ctx, info);
    };
  }
}

module.exports = {
  authorized: AuthorizedDirective,
};
