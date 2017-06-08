/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Animated,
  Button,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { login } from './utils/api';
import logo from '../assets/logo_2x.png';
import * as colors from './utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  keyboardAvoidingViewContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.green,
    paddingLeft: 32,
    paddingRight: 32,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  'logo-container': {
    marginTop: 24,
    marginBottom: 24,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logo: {
    width: 100,
    height: 100,
  },
  inputView: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightWhite,
    marginBottom: 16,
  },
  inputViewFocus: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 16,
  },
  input: {
    height: 40,
  },
  errorView: {
    backgroundColor: colors.lightWhite,
    padding: 8,
  },
  error: {
    color: colors.red,
  },
  buttonWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.green,
    width: 5,
    height: 5,
  },
});

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
  };

  state = {
    email: '',
    password: '',
    errorMessage: '',
    // Used to show a loading spinner while the user is being authenticated.
    isLoading: false,
    // Used by the `TextInput` to know if the field is focused.
    isEmailFocused: false,
    // Used by the `TextInput` to know if the field is focused.
    isPasswordFocused: false,
  };

  // Describe how the animations should look like
  animatedValue = new Animated.Value(0);
  animatedButtonScale = new Animated.Value(1);
  animatedStyle = {
    opacity: this.animatedValue,
  };
  animatedButtonStyles = {
    transform: [{ scale: this.animatedButtonScale }],
  };

  componentDidMount = () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.errorMessage)
      this.setState({ errorMessage: nextProps.errorMessage });
  };

  handleEmailChange = email => {
    this.setState({ email });
  };

  handlePasswordChange = password => {
    this.setState({ password });
  };

  handleSubmit = () => {
    const { props, state } = this;

    this.setState({ isLoading: true });

    login({
      email: state.email,
      password: state.password,
    }).then(
      response => {
        // Show an animation on the login button after the user has been
        // successfully authenticated and before showing the next screen.
        Animated.timing(this.animatedButtonScale, {
          toValue: 400,
          timing: 100,
          useNativeDriver: true,
        }).start(() => {
          // Notify the Application that the user can be logged in.
          props.onLogin(response.token);
        });
      },
      error => {
        this.setState({ isLoading: false, errorMessage: error.message });
      }
    );
  };

  render = () => {
    const { state } = this;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardAvoidingViewContainer}
        >
          <View style={styles['logo-container']}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <ActivityIndicator animating={state.isLoading} color={colors.white} />

          {state.errorMessage
            ? <View style={styles.errorView}>
                <Text style={styles.error}>
                  {state.errorMessage}
                </Text>
              </View>
            : null}

          <Animated.View style={[styles.form, this.animatedStyle]}>
            <View
              style={
                state.isEmailFocused ? styles.inputViewFocus : styles.inputView
              }
            >
              <TextInput
                // Field properties
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="unless-editing"
                keyboardType="email-address"
                returnKeyType="next"
                color={colors.white}
                style={styles.input}
                // Field attributes
                value={state.email}
                onChangeText={this.handleEmailChange}
                onSubmitEditing={() => this.refs.password.focus()}
                onBlur={() => this.setState({ isEmailFocused: false })}
                onFocus={() => this.setState({ isEmailFocused: true })}
                placeholder="Email"
                placeholderTextColor={colors.lightWhite}
              />
            </View>
            <View
              style={
                state.isPasswordFocused
                  ? styles.inputViewFocus
                  : styles.inputView
              }
            >
              <TextInput
                // Field properties
                ref="password"
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="unless-editing"
                returnKeyType="go"
                secureTextEntry={true} // password
                color={colors.white}
                style={styles.input}
                // Field attributes
                value={state.password}
                onChangeText={this.handlePasswordChange}
                onSubmitEditing={this.handleSubmit}
                onBlur={() => this.setState({ isPasswordFocused: false })}
                onFocus={() => this.setState({ isPasswordFocused: true })}
                placeholder="Password"
                placeholderTextColor={colors.lightWhite}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                title="Login"
                color={colors.white}
                onPress={this.handleSubmit}
                disabled={state.isLoading}
              />
              <Animated.View
                style={[styles.button, this.animatedButtonStyles]}
              />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    );
  };
}
