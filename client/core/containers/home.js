import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Home from '../components/home';

const syncUserGithubStarsMutation = gql`
  mutation syncUserGithubStars {
    syncUserGithubStars {
      id
      github {
        lastSync
      }
    }
  }
`;

const HomeWithMutation = graphql(syncUserGithubStarsMutation, {
  props: ({ mutate }) => ({
    syncUserGithubStars: () => mutate({}),
  }),
})(Home);

export default HomeWithMutation;
