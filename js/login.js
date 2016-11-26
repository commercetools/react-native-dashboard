/* @flow */

import React, { Component, PropTypes } from 'react'
import {
  Button,
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
} from 'react-native'
import {
  login,
  getProjectsForUser,
} from './utils/api'
import logo from '../assets/logo.png'
import * as colors from './utils/colors'

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
  logo: {},
  inputView: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.5)',
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
  errorView: {},
  error: {
    color: colors.yellow,
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
})

export default class Login extends Component {

  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onLoginError: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
  }

  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      isLoading: false,
      isEmailFocused: false,
      isPasswordFocused: false,
    }

    // Bind functions
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.animatedValue = new Animated.Value(0)
    this.animatedButtonScale = new Animated.Value(1)
  }

  componentDidMount () {
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 300,
      },
    ).start()
  }

  handleEmailChange (email) {
    this.setState({ email })
  }

  handlePasswordChange (password) {
    this.setState({ password })
  }

  handleSubmit () {
    const { props, state } = this

    this.setState({ isLoading: true })

    login({
      email: state.email,
      password: state.password,
    })
    .then(
      loginResponse =>
        getProjectsForUser({
          token: loginResponse.token,
          userId: loginResponse.user,
        })
        .then((projectsResponse) => {
          Animated.timing(
            this.animatedButtonScale,
            {
              toValue: 400,
              timing: 100,
            },
          ).start(() => {
            props.onLogin({
              token: loginResponse.token,
              userId: loginResponse.user,
              projects: projectsResponse,
            })
          })
        }),
      (error) => {
        this.setState({ isLoading: false })
        props.onLoginError(error)
      },
    )
  }

  render () {
    const { props, state } = this
    const animatedStyle = {
      opacity: this.animatedValue,
    }
    const animatedButtonStyles = {
      transform: [{ scale: this.animatedButtonScale }],
    }
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardAvoidingViewContainer}
        >
          <View style={styles['logo-container']}>
            <Image source={logo} style={styles.logo} />
          </View>
          <ActivityIndicator animating={state.isLoading} color="white"/>
          {props.errorMessage ? (
            <View style={styles.errorView}>
              <Text style={styles.error}>{props.errorMessage}</Text>
            </View>
          ) : null}
          <Animated.View style={[styles.form, animatedStyle]}>
            <View
              style={state.isEmailFocused
                ? styles.inputViewFocus
                : styles.inputView
              }
            >
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onChangeText={this.handleEmailChange}
                onSubmitEditing={() => this.refs.password.focus()}
                onFocus={() => this.setState({ isEmailFocused: true })}
                onBlur={() => this.setState({ isEmailFocused: false })}
                value={state.email}
                keyboardType="email-address"
                returnKeyType="next"
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                color="white"
                clearButtonMode="unless-editing"
              />
            </View>
            <View
              style={state.isPasswordFocused
                ? styles.inputViewFocus
                : styles.inputView
              }
            >
              <TextInput
                ref='password'
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                onChangeText={this.handlePasswordChange}
                onSubmitEditing={this.handleSubmit}
                onFocus={() => this.setState({ isPasswordFocused: true })}
                onBlur={() => this.setState({ isPasswordFocused: false })}
                value={state.password}
                secureTextEntry={true} // password
                returnKeyType="go"
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                color="white"
                clearButtonMode="unless-editing"
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                title="Login"
                color="white"
                onPress={this.handleSubmit}
                disabled={state.isLoading}
              />
              <Animated.View style={[styles.button, animatedButtonStyles]} />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    )
  }
}
