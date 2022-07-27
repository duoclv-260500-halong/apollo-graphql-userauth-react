const { ApolloServer } = require('apollo-server-express')
const cors = require('micro-cors')()
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const context = require('./context')
const directives = require('./directives')
const express = require('express');

// Initialize Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: context,
  introspection: true,
  playground: true,
  schemaDirectives: directives
})
const app = express();
server.start().then(res => {
  server.applyMiddleware({app});
  app.listen({port: 4000}, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    console.log()
  }
  )

})
