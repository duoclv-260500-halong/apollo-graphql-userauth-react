const { gql } = require('apollo-server-express')

// GraphQL schema
const typeDefs = gql`

directive @isAuthenticated on FIELD_DEFINITION

directive @hasRole(roles: [Role!]) on FIELD_DEFINITION

enum Role{
  ADMIN
  USER
}

scalar Date

type Book{
  id: ID,
  name: String!,
  genre: String!
}
type User {
    id: ID!
    email: String!
    password: String!
    firstname: String!
    lastname: String!
    name: String
    role: Role!
    created: Date
    created_by: String!
    updated: Date
    updated_by: String!
  }
  type Token {
    token: String!
  }
  
  type Response {
    success: Boolean!
    message: String
  }
  
  type Query {
    currentUser: User @isAuthenticated
    users: [User] @isAuthenticated
    loginUser(email: String!, password: String!): Token 
  }
  type Mutation {
    createUser(email: String!, password: String!, firstname: String!, lastname: String!): User
    updateUser(id: ID!, email: String, password: String, firstname: String, lastname: String): Response
    deleteUser(id: ID): Response
  }
  `
  
  module.exports = typeDefs