/* @flow */

import React, { Component } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

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
    console.log(this.state)
  }

  render () {
    const { state } = this
    return (
      <View style={styles.container}>
        <View style={styles['logo-container']}>
          <Text>{'LOGO'}</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={this.handleEmailChange}
          value={state.email}
        />
        <TextInput
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
