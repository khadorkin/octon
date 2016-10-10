import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Root from '../components/root';

const repositoryQuery = gql`
  query currentUser {
    currentUser {
      photo
      lastSync
    }
  }
`;

const RootWithData = graphql(repositoryQuery, {
  props: ({ data: { loading, currentUser, error } }) => ({
    loading,
    user: currentUser,
    error,
  }),
})(Root);

const syncUserStarsMutation = gql`
  mutation syncUserStars {
    syncUserStars
  }
`;

const RootWithDataAndMutation = graphql(syncUserStarsMutation, {
  props: ({ mutate }) => ({
    syncUserStars: () => mutate({}),
  }),
})(RootWithData);

export default RootWithDataAndMutation;
