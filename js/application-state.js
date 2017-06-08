/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { withApollo } from 'react-apollo';

const initialState = {
  token: null,
  selectedProjectKey: null,
};

class ApplicationState extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    client: PropTypes.shape({
      resetStore: PropTypes.func.isRequired,
    }),
  };
  state = { ...initialState };
  cacheIsLoaded = false;

  componentDidMount = () => {
    // Load cached state
    AsyncStorage.multiGet(
      ['token', 'selectedProjectKey'],
      (error, stores) => {
        let cachedState;
        if (error) cachedState = initialState;
        else
          cachedState = stores.reduce((acc, [key, value]) => {
            const parsedValue = JSON.parse(value);
            return {
              ...acc,
              ...(parsedValue ? { [key]: parsedValue } : {}),
            };
          }, initialState);

        this.cacheIsLoaded = true;
        this.setState(cachedState);
      }
    );
  };

  componentDidUpdate = () => {
    // Persist state
    AsyncStorage.multiSet([
      ['token', JSON.stringify(this.state.token)],
      ['selectedProjectKey', JSON.stringify(this.state.selectedProjectKey)],
    ]);
  };

  handleSetToken = token => {
    this.setState({ token });
  };

  handleSetProjectKey = projectKey => {
    this.setState({ selectedProjectKey: projectKey });
  };

  handleLogout = () => {
    // this.props.client.resetStore()
    this.setState(initialState);
  };

  render = () => {
    if (!this.cacheIsLoaded) return null;
    return this.props.children({
      ...this.state,
      setToken: this.handleSetToken,
      setProjectKey: this.handleSetProjectKey,
      logout: this.handleLogout,
    });
  };
}

export default withApollo(ApplicationState)
