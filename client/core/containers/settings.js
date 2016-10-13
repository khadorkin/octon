import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Settings from '../components/settings';

const trackRepositoryMutation = gql`
  mutation setNotification($type: String!, $active: Boolean!) {
    setNotification(type: $type, active: $active) {
      id
      dailyNotification
      weeklyNotification
    }
  }
`;

// TODO optimistic ui
const SettingsWithMutations = graphql(trackRepositoryMutation, {
  props: ({ mutate }) => ({
    setNotification: (type, active) => mutate({
      variables: { type, active },
    }),
  }),
})(Settings);

export default SettingsWithMutations;
