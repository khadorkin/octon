import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

export const rootSchema = [`
type User {
  id: String!
  username: String!
  photo: String!
  lastSync: String
}

type Query {
  # Get current user
  currentUser: User
}

type Mutation {
  # Sync user stars
  syncUserStars: Boolean
}

schema {
  query: Query
  mutation: Mutation
}
`];

export const schema = [...rootSchema];

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});
