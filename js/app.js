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
      projects: [],
      activeProjectId: null,
      errorMessage: null,
    }

    // Bind functions
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLoginError = this.handleLoginError.bind(this)
  }

  handleLogin (data) {
    const projects = data.projects
    const hasProjects = projects.length > 0

    this.setState({
      token: data.token,
      userId: data.userId,
      projects: projects.reduce(
        (acc, project) => ({
          ...acc,
          [project.id]: project,
        }),
        {},
      ),
      activeProjectId: hasProjects ? projects[0].id : null,
      errorMessage: hasProjects ? null : 'User has no projects',
    })
  }

  handleLoginError (error) {
    this.setState({
      errorMessage: error.message,
    })
  }

  render () {
    // const { state } = this
    // FIXME: persist state
    const state = {
      token: 'GwMWmbBjRvs94avfeuO3NUd34sFIdmpgV+2VpPEkKME=',
      activeProjectId: '0b7449c4-2298-4959-80d3-989dcb234983',
      projects: {
        '0b7449c4-2298-4959-80d3-989dcb234983': {
          id: '0b7449c4-2298-4959-80d3-989dcb234983',
          key: 'test-with-big-data-44',
          name: 'Test with big data',
        },
      },
    }

    // Allow to access the application only if there is a token and there is
    // an active project (e.g. user has access to no projects)
    return state.token && state.activeProjectId
      ? (
        <Dashboard
          token={state.token}
          projects={state.projects}
          activeProjectId={state.activeProjectId}
        />
      )
      : (
        <Login
          onLogin={this.handleLogin}
          onLoginError={this.handleLoginError}
          errorMessage={state.errorMessage}
        />
      )
  }
}

AppRegistry.registerComponent('MerchantCenterIOSDashboard', () => Application)
