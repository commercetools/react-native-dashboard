/* @flow */

import React, { Component } from 'react'
import {
  AppRegistry,
  AsyncStorage,
} from 'react-native'
import { defaultMemoize } from 'reselect'
import { getProjectsForUser } from './utils/api'
import Login from './login'
import Dashboard from './dashboard'
import Landing from './landing'

const initialState = {
  canStart: false,
  token: null,
  userId: null,
  projects: [],
  activeProjectId: null,
  activeProjectIds: [],
  inactiveProjectIds: [],
  errorMessage: null,
}
const selectActiveAndInactiveProjectIds = defaultMemoize(
  projects => projects.reduce((acc, project) => {
    const now = Date.now()
    const isActive = (
      // pick a project without a `trialUntil`
      !project.trialUntil ||
      // or pick a project that has not expired yet
      (now < new Date(project.trialUntil).getTime())
    )
    const updatedActiveProjects = isActive
      ? acc[0].concat(project.id)
      : acc[0]
    const updatedInactiveProjects = isActive
      ? acc[1]
      : acc[1].concat(project.id)
    return [
      updatedActiveProjects,
      updatedInactiveProjects,
    ]
  }, [[/* active */], [/* inactive */]]),
)

export default class Application extends Component {
  constructor (props) {
    super(props)

    this.state = initialState

    // Bind functions
    this.refetchProjects = this.refetchProjects.bind(this)
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
        'activeProjectIds',
        'inactiveProjectIds',
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
          canStart: true, // <-- this will tell the app that it can render
        })

        // If the user is already logged in, refetch
        // the projects to get fresh data
        if (cachedState.token)
          this.refetchProjects()
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
      ['activeProjectIds', JSON.stringify(this.state.activeProjectIds)],
      ['inactiveProjectIds', JSON.stringify(this.state.inactiveProjectIds)],
    ])
  }

  refetchProjects () {
    getProjectsForUser({
      token: this.state.token,
      userId: this.state.userId,
    })
    .then(
      (projectsResponse) => {
        this.handleLogin({
          token: this.state.token,
          userId: this.state.userId,
          projects: projectsResponse,
        })
      },
      error => this.handleLoginError(error),
    )
  }

  handleLogin (data) {
    const sortedProjectsByName = data.projects.sort((left, right) => {
      const a = left.name.toLowerCase()
      const b = right.name.toLowerCase()
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
    const [
      activeProjects,
      inactiveProjects,
    ] = selectActiveAndInactiveProjectIds(sortedProjectsByName)

    const newState = {
      token: data.token,
      userId: data.userId,
      projects: sortedProjectsByName.reduce(
        (acc, project) => ({
          ...acc,
          [project.id]: project,
        }),
        {},
      ),
      activeProjectId: activeProjects[0],
      activeProjectIds: activeProjects,
      inactiveProjectIds: inactiveProjects,
      errorMessage: sortedProjectsByName.length > 0
        ? null
        : 'User has no projects',
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

    if (!state.canStart) return <Landing/>

    // Allow to access the application only if there is a token and there is
    // an active project (e.g. user has access to no projects)
    return state.token && state.activeProjectId
      ? (
        <Dashboard
          token={state.token}
          projects={state.projects}
          activeProjectId={state.activeProjectId}
          activeProjectIds={state.activeProjectIds}
          inactiveProjectIds={state.inactiveProjectIds}
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
