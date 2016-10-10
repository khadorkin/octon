import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import RepositoriesList from '../components/repositories-list';

const repositoryQuery = gql`
  query userRepositories($page: Int) {
    userRepositories(page: $page) {
      id
      fullName
      photo
      htmlUrl
      githubId
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

export default RootWithData;
