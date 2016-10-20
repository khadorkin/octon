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

const SettingsWithMutation = graphql(trackRepositoryMutation, {
  props: ({ mutate }) => ({
    setNotification: (type, active, user) => mutate({
      variables: { type, active },
      optimisticResponse: {
        __typename: 'Mutation',
        setNotification: {
          __typename: 'User',
          id: user.id,
          dailyNotification: type === 'daily' ? active : user.dailyNotification,
          weeklyNotification: type === 'weekly' ? active : user.weeklyNotification,
        },
      },
    }),
  }),
})(Settings);

const editUserEmailMutation = gql`
  mutation editUserEmail($email: String!) {
    editUserEmail(email: $email) {
      id
      email
    }
  }
`;

const SettingsWithMutations = graphql(editUserEmailMutation, {
  props: ({ mutate }) => ({
    editUserEmail: email => mutate({
      variables: { email },
    }),
  }),
})(SettingsWithMutation);

export default SettingsWithMutations;
