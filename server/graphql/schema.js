import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

export const rootSchema = [`
type UserGithub {
  username: String!
  lastSync: String
}

type UserDocker {
  username: String!
  lastSync: String
}

type User {
  id: String!
  photo: String!
  email: String!
  lastSync: String
  dailyNotification: Boolean!
  weeklyNotification: Boolean!
  github: UserGithub!
  docker: UserDocker
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
  currentUser: User!
  # Get user starred repositories
  userRepositories(page: Int, search: String): [Repository]
}

type Mutation {
  # Sync user stars
  syncUserGithubStars: User!
  # Sync user stars
  trackRepository(repositoryId: String! active: Boolean!): Repository!
  # Set user notification
  setNotification(type: String! active: Boolean!): User!
  # Edit user email
  editUserEmail(email: String!): User!
  # Add a docker account to user
  addDockerAccount(username: String!): User!
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
