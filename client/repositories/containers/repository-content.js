import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import RepositoryContent from '../components/repository-content';

const repositoryQuery = gql`
  query repository($type: String!, $name: String!) {
    repository(type: $type, name: $name) {
      id
      name
      description
      photo
      htmlUrl
      starred
      latestRelease {
        tagName
        description
        htmlUrl
        publishedAt
      }
    }
  }
`;

const RepositoryContentWithData = graphql(repositoryQuery, {
  skip: ({ repositoryType }) => !repositoryType,
  options: ({ repositoryType, repositoryName }) => ({
    variables: { type: repositoryType, name: repositoryName },
  }),
  props: ({ data: { loading, repository, error } }) => ({
    loading,
    repository,
    error,
  }),
})(RepositoryContent);

const trackRepositoryMutation = gql`
  mutation trackRepository($repositoryId: String!, $active: Boolean!) {
    trackRepository(repositoryId: $repositoryId, active: $active) {
      id
      starred
    }
  }
`;

const RepositoryContentWithDataAndMutation = graphql(trackRepositoryMutation, {
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
})(RepositoryContentWithData);

export default RepositoryContentWithDataAndMutation;
