import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Root from '../components/root';

const repositoryQuery = gql`
  query currentUser {
    currentUser {
      photo
    }
  }
`;

const RootWithData = graphql(repositoryQuery, {
  props: ({ data: { loading, currentUser } }) => ({
    loading,
    user: currentUser,
  }),
})(Root);

export default RootWithData;
