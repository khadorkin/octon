import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Root from '../components/root';

const currentUserQuery = gql`
  query currentUser {
    currentUser {
      id
      photo
      email
      dailyNotification
      weeklyNotification
      github {
        username
        lastSync
      }
      docker {
        username
        lastSync
      }
    }
  }
`;

const RootWithData = graphql(currentUserQuery, {
  props: ({ data: { loading, currentUser, error, startPolling, stopPolling } }) => ({
    loading,
    user: currentUser,
    error,
    startPolling,
    stopPolling,
  }),
  options: { pollInterval: 5000 },
})(Root);

export default RootWithData;
