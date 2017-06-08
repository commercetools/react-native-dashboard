/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import Landing from './landing';
import ApplicationView from './application-view';
import LoginView from './login-view';

export default class Application extends Component {
  static propTypes = {
    token: PropTypes.string,
    selectedProjectKey: PropTypes.string,
    setToken: PropTypes.func.isRequired,
    setProjectKey: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  state = {
    isAnimating: true,
  };

  animatedValue = new Animated.Value(0);
  animatedStyle = { transform: [{ translateY: this.animatedValue }] };

  componentDidMount = () => {
    const endAnimation = this.props.token
      ? [
          // If the user is logged in, end the animation outside the screen
          Animated.spring(this.animatedValue, {
            toValue: -400,
            friction: 10,
            tension: 50,
            velocity: 1,
            useNativeDriver: true,
          }),
        ]
      : [
          // If the user is not logged in, end the animation more or less
          // in the center of the screen.
          Animated.spring(this.animatedValue, {
            // This position is where the logo will be shown in the
            // login screen.
            toValue: -88,
            friction: 10,
            tension: 50,
            useNativeDriver: true,
          }),
        ];
    // Define a sequence of animations before starting the application.
    // - wait 1sec
    // - move down
    // - end the animation (see above)
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedValue, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
      ...endAnimation,
    ]).start(() => {
      this.setState({ isAnimating: false });
    });
  };

  render = () => {
    if (this.state.isAnimating)
      return <Landing animatedStyle={this.animatedStyle} />;

    if (this.props.token)
      return <ApplicationView {...this.props} />;

    return (
      <LoginView onLogin={this.props.setToken} />
    );
  };
}
