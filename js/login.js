/* @flow */

import React, { Component, PropTypes } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { login } from './utils/api'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingLeft: 32,
    paddingRight: 32,
  },
  'logo-container': {
    paddingTop: 24,
    paddingBottom: 24,
  },
  input: {
    backgroundColor: 'red',
    height: 40,
    marginBottom: 16,
  },
})

export default class Login extends Component {

  static propTypes = {
    onLogin: PropTypes.func.isRequired,
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
    login({
      email: this.state.email,
      password: this.state.password,
    })
    .then(this.props.onLogin)
    .catch((error) => {
      console.error('Got an error on login', error)
    })
  }

  render () {
    const { state } = this
    return (
      <View style={styles.container}>
        <View style={styles['logo-container']}>
          <Text>{'LOGO'}</Text>
        </View>
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={this.handleEmailChange}
          value={state.email}
        />
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={this.handlePasswordChange}
          value={state.password}
          secureTextEntry={true} // password
        />
        <Button
          title="Login"
          color="red"
          onPress={this.handleSubmit}
        />
      </View>
    )
  }
}
