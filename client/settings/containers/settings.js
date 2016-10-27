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

let SettingsWithMutation = graphql(trackRepositoryMutation, {
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

SettingsWithMutation = graphql(editUserEmailMutation, {
  props: ({ mutate }) => ({
    editUserEmail: email => mutate({
      variables: { email },
    }),
  }),
})(SettingsWithMutation);

const addDockerAccountMutation = gql`
  mutation addDockerAccount($username: String!) {
    addDockerAccount(username: $username) {
      id
      docker {
        username
      }
    }
  }
`;

SettingsWithMutation = graphql(addDockerAccountMutation, {
  props: ({ mutate }) => ({
    addDockerAccount: username => mutate({
      variables: { username },
    }),
  }),
})(SettingsWithMutation);

const syncUserGithubStarsMutation = gql`
  mutation syncUserGithubStars {
    syncUserGithubStars {
      id
      github {
        lastSync
      }
      docker {
        lastSync
      }
    }
  }
`;

SettingsWithMutation = graphql(syncUserGithubStarsMutation, {
  props: ({ mutate }) => ({
    syncUserGithubStars: () => mutate({}),
  }),
})(SettingsWithMutation);

const syncUserDockerStarsMutation = gql`
  mutation syncUserDockerStars {
    syncUserDockerStars {
      id
      github {
        lastSync
      }
      docker {
        lastSync
      }
    }
  }
`;

SettingsWithMutation = graphql(syncUserDockerStarsMutation, {
  props: ({ mutate }) => ({
    syncUserDockerStars: () => mutate({}),
  }),
})(SettingsWithMutation);

const deleteUserAccountMutation = gql`
  mutation deleteUserAccount {
    deleteUserAccount
  }
`;

const SettingsWithMutations = graphql(deleteUserAccountMutation, {
  props: ({ mutate }) => ({
    deleteUserAccount: () => mutate({}),
  }),
})(SettingsWithMutation);

export default SettingsWithMutations;
