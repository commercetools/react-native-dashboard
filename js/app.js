/* @flow */

import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import Login from './login'
import Dashboard from './dashboard'

export default class Application extends Component {
  constructor (props) {
    super(props)

    this.state = {
      token: null,
      userId: null,
    }

    // Bind functions
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin (data) {
    this.setState({
      token: data.token,
      userId: data.user,
    })
  }

  render () {
    const { state } = this
    return state.token
      ? (
        <Dashboard />
      )
      : (
        <Login onLogin={this.handleLogin} />
      )
  }
}

AppRegistry.registerComponent('MerchantCenterIOSDashboard', () => Application)
