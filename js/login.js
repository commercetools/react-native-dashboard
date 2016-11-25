/* @flow */

import React, { Component, PropTypes } from 'react'
import {
  Button,
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
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
    backgroundColor: '#F5FCFF',
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
    borderBottomColor: colors.grey,
    marginBottom: 16,
  },
  input: {
    height: 40,
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
    }

    // Bind functions
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmailChange (email) {
    this.setState({ email })
  }

  handlePasswordChange (password) {
    this.setState({ password })
  }

  handleSubmit () {
    const { props, state } = this

    login({
      email: state.email,
      password: state.password,
    })
    .then(loginResponse =>
      getProjectsForUser({
        token: loginResponse.token,
        userId: loginResponse.userId,
      })
      .then((projectsResponse) => {
        props.onLogin({
          token: loginResponse.token,
          userId: loginResponse.userId,
          projects: projectsResponse,
        })
      }),
    )
    .catch(props.onLoginError)
  }

  render () {
    const { props, state } = this
    return (
      <View style={styles.container}>
        <View style={styles['logo-container']}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            onChangeText={this.handleEmailChange}
            value={state.email}
            placeholder="Email"
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
          />
        </View>

        {props.errorMessage ? (
          <View>
            <Text>{props.errorMessage}</Text>
          </View>
        ) : null}

        <Button
          title="Login"
          color={colors.green}
          onPress={this.handleSubmit}
        />
      </View>
    )
  }
}
