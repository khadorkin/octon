import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './core/containers/root';
import './styles.scss';

// Needed by material-ui
injectTapEventPlugin();

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
});
const client = new ApolloClient({
  networkInterface,
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
      return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById('content')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render(
      <AppContainer>
        <ApolloProvider client={client}>
          <Root />
        </ApolloProvider>,
      </AppContainer>,
      document.getElementById('content')
    );
  });
}
