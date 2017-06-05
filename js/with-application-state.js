/* @flow */

import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

const initialState = {
  token: null,
  selectedProjectKey: null,
};

export default function withAppState(WrappedComponent) {
  class ApplicationState extends Component {
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
      this.setState(initialState);
    };

    render = () => {
      if (!this.cacheIsLoaded) return null;
      return (
        <WrappedComponent
          {...this.state}
          setToken={this.handleSetToken}
          setProjectKey={this.handleSetProjectKey}
          logout={this.handleLogout}
        />
      );
    };
  }

  return ApplicationState;
}
