import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

export const rootSchema = [`
type User {
  id: String!
  username: String!
  photo: String!
  lastSync: String
}

type Release {
  tagName: String!
  htmlUrl: String!
  publishedAt: String!
}

type Repository {
  id: String!
  name: String!
  fullName: String!
  photo: String!
  htmlUrl: String!
  starred: Boolean!
  githubId: String!
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
