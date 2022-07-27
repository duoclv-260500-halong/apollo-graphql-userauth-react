const { ApolloServer, SchemaDirectiveVisitor, ForbiddenError } = require('apollo-server-micro')
const { defaultFieldResolver } = require('graphql')

// Custom directive to check if user is authenicated
class isAuthenticated extends ApolloServer {
  // Field definition SchemaDirectiveVisitor
  visitFieldDefinition (field) {
    // Get field resolver
    const { resolve = defaultFieldResolver } = field
    console.log(123);
    field.resolve = async function (...args) {
      // Check if user email is in context
      if (!args[2].email) {
        throw new ForbiddenError('You are not authorized for this ressource.')
      }

      // Resolve field
      return resolve.apply(this, args)
    }
  }
}

module.exports = { isAuthenticated: isAuthenticated }