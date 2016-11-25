/* @flow */

import React, { Component } from 'react'
import {
  AppRegistry,
  AsyncStorage,
} from 'react-native'
import Login from './login'
import Dashboard from './dashboard'

const initialState = {
  canStart: false,
  token: null,
  userId: null,
  projects: [],
  activeProjectId: null,
  errorMessage: null,
}

export default class Application extends Component {
  constructor (props) {
    super(props)

    this.state = initialState

    // Bind functions
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLoginError = this.handleLoginError.bind(this)
    this.handleSelectProject = this.handleSelectProject.bind(this)
  }

  componentWillMount () {
    // Load cached state
    AsyncStorage.multiGet(
      [
        'token',
        'userId',
        'projects',
        'activeProjectId',
      ],
      (error, stores) => {
        if (error) {
          console.warn('Error while reading state from storage', error)
          return
        }
        const cachedState = stores.reduce((acc, [ key, value ]) => ({
          ...acc,
          [key]: JSON.parse(value),
        }), {})
        this.setState({
          ...cachedState,
          canStart: true,
        })
      },
    )
  }

  componentDidUpdate () {
    // Persist state
    AsyncStorage.multiSet([
      ['token', JSON.stringify(this.state.token)],
      ['userId', JSON.stringify(this.state.userId)],
      ['projects', JSON.stringify(this.state.projects)],
      ['activeProjectId', JSON.stringify(this.state.activeProjectId)],
    ])
  }

  handleLogin (data) {
    const projects = data.projects
    const hasProjects = projects.length > 0

    const newState = {
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
    }
    this.setState(newState)
  }

  handleLoginError (error) {
    this.setState({
      errorMessage: error.message,
    })
  }

  handleSelectProject (projectId) {
    this.setState({ activeProjectId: projectId })
  }

  render () {
    const { state } = this

    console.log(state)
    if (!state.canStart) return null

    // Allow to access the application only if there is a token and there is
    // an active project (e.g. user has access to no projects)
    return state.token && state.activeProjectId
      ? (
        <Dashboard
          token={state.token}
          projects={state.projects}
          activeProjectId={state.activeProjectId}
          onSelectProject={this.handleSelectProject}
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
