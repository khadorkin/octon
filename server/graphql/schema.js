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

schema {
  query: Query
}
`];

export const schema = [...rootSchema];

export default makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});
