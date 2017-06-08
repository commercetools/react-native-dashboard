/* @flow */

import React from 'react';
import {
  AppRegistry,
  AsyncStorage,
} from 'react-native';
import { IntlProvider } from 'react-intl';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import ApplicationState from './application-state';
import Application from './application';

// Apollo client setup
const networkInterface = createNetworkInterface({
  uri: 'https://mc.escemo.com/graphql',
});
// Use a middleware to update the request headers with the correct params.
networkInterface.use([
  {
    /* eslint-disable no-param-reassign */
    applyMiddleware(req, next) {
      if (!req.options.headers) req.options.headers = {};
      req.options.headers['Accept'] = 'application/json';
      AsyncStorage.multiGet(['token'], (err, state) => {
        req.options.headers['Authorization'] = JSON.parse(state[0][1]);
        req.options.headers['X-Project-Key'] =
          req.request.variables['projectKey'];
        req.options.headers['X-Graphql-Target'] =
          req.request.variables['target'];
        next();
      });
    },
    /* eslint-enable no-param-reassign */
  },
]);
const client = new ApolloClient({ networkInterface });

const Root = () => (
  <IntlProvider
    key="intl"
    locale={'en'}
    messages={{
      /* TODO */
    }}
  >
    <ApolloProvider client={client}>
      <ApplicationState>
        {props => <Application {...props} />}
      </ApplicationState>
    </ApolloProvider>
  </IntlProvider>
);
Root.displayName = 'Root'

export default Root;

AppRegistry.registerComponent('CTPDashboard', () => Root);
