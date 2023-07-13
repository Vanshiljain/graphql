const typeDefs = `
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): String
  }

  type User {
    id: ID!
    username: String!
  }
`;

export default typeDefs;
