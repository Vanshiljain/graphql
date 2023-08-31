const typeDefs = `
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): String
  }

  type User {
    id: ID!
    userName: String!
  }
`;

export default typeDefs;
