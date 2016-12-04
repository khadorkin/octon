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
  description: String
  htmlUrl: String!
  publishedAt: String!
}

type Repository {
  id: String!
  name: String!
  description: String
  photo: String!
  htmlUrl: String!
  starred: Boolean!
  type: String!
  latestRelease: Release
}

type Query {
  # Get current user
  currentUser: User!
  # Get user starred repositories
  userRepositories(page: Int, search: String): [Repository]
  # Get single repository
  repository(type: String!, name: String!): Repository
}

type Mutation {
  # Change tracking of repository
  trackRepository(repositoryId: String! active: Boolean!): Repository!
  # Set user notification
  setNotification(type: String! active: Boolean!): User!
  # Edit user email
  editUserEmail(email: String!): User!
  # Add a docker account to user
  addDockerAccount(username: String!): User!
  # Remove a docker account to user
  removeDockerAccount: User!
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
