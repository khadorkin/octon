import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import RepositoriesList from '../components/repositories-list';

const repositoryQuery = gql`
  query userRepositories($page: Int) {
    userRepositories(page: $page) {
      id
      name
      photo
      htmlUrl
      starred
      latestRelease {
        tagName
        htmlUrl
        publishedAt
      }
    }
  }
`;

const RootWithData = graphql(repositoryQuery, {
  props({ data: { loading, error, userRepositories, fetchMore, refetch } }) {
    return {
      loading,
      error,
      repositories: userRepositories,
      queryRefetch: refetch,
      loadMoreRepositories: ({ page }) =>
        fetchMore({
          variables: {
            page,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult.data) { return previousResult; }
            return Object.assign({}, previousResult, {
              userRepositories: [
                ...previousResult.userRepositories,
                ...fetchMoreResult.data.userRepositories,
              ],
            });
          },
        }),
    };
  },
})(RepositoriesList);

const trackRepositoryMutation = gql`
  mutation trackRepository($repositoryId: String!, $active: Boolean!) {
    trackRepository(repositoryId: $repositoryId, active: $active) {
      id
      starred
    }
  }
`;

const RootWithDataAndMutations = graphql(trackRepositoryMutation, {
  props: ({ mutate }) => ({
    trackRepository: (repositoryId, active) => mutate({
      variables: { repositoryId, active },
      optimisticResponse: {
        __typename: 'Mutation',
        trackRepository: {
          id: repositoryId,
          __typename: 'Repository',
          starred: active,
        },
      },
    }),
  }),
})(RootWithData);

export default RootWithDataAndMutations;
