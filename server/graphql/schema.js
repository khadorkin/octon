import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

export const rootSchema = [`
type User {
  id: String!
  username: String!
  photo: String!
  email: String!
  lastSync: String
  dailyNotification: Boolean!
  weeklyNotification: Boolean!
}

type Release {
  tagName: String!
  htmlUrl: String!
  publishedAt: String!
}

type Repository {
  id: String!
  name: String!
  photo: String!
  htmlUrl: String!
  starred: Boolean!
  latestRelease: Release
}

type Query {
  # Get current user
  currentUser: User
  # Get user starred repositories
  userRepositories(page: Int): [Repository]
}

type Mutation {
  # Sync user stars
  syncUserStars: Boolean
  # Sync user stars
  trackRepository(repositoryId: String! active: Boolean!): Repository
  # Set user notification
  setNotification(type: String! active: Boolean!): User
  # Delete account
  deleteUserAccount: Boolean
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
