import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import RepositoriesList from '../components/repositories-list';

const repositoryQuery = gql`
  query userRepositories($page: Int, $search: String) {
    userRepositories(page: $page, search: $search) {
      id
      name
      photo
      htmlUrl
      type
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
      loadMoreRepositories: ({ page, search }) =>
        fetchMore({
          variables: {
            page,
            search,
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
  options: { forceFetch: true },
})(RepositoriesList);

export default RootWithData;
