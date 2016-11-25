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
  Easing,
} from 'react-native'
import {
  login,
  getProjectsForUser,
} from './utils/api'
import logo from '../assets/logo.png'
import * as colors from './colors'

const styles = StyleSheet.create({
  container: {
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
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    marginBottom: 16,
  },
  input: {
    height: 40,
  },
  errorView: {},
  error: {
    color: colors.red,
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
    }

    // Bind functions
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.animatedValue = new Animated.Value(0)
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
          props.onLogin({
            token: loginResponse.token,
            userId: loginResponse.user,
            projects: projectsResponse,
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
    return (
      <View style={styles.container}>
        <View style={styles['logo-container']}>
          <Image source={logo} style={styles.logo} />
        </View>
        <ActivityIndicator animating={state.isLoading} color="white"/>
        {props.errorMessage ? (
          <View style={styles.errorView}>
            <Text style={styles.error}>{props.errorMessage}</Text>
          </View>
        ) : null}
        <Animated.View style={animatedStyle}>
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              onChangeText={this.handleEmailChange}
              value={state.email}
              placeholder="Email"
              color="white"
              />
          </View>
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              onChangeText={this.handlePasswordChange}
              value={state.password}
              secureTextEntry={true} // password
              placeholder="Password"
              color="white"
              />
          </View>

          <Button
            title="Login"
            color="white"
            onPress={this.handleSubmit}
            disabled={state.isLoading}
            />
        </Animated.View>
      </View>
    )
  }
}
