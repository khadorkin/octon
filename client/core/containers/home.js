import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Home from '../components/home';

const syncUserStarsMutation = gql`
  mutation syncUserStars {
    syncUserStars
  }
`;

const HomeWithMutation = graphql(syncUserStarsMutation, {
  props: ({ mutate }) => ({
    syncUserStars: () => mutate({}),
  }),
})(Home);

export default HomeWithMutation;
