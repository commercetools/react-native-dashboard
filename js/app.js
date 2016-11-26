/* @flow */

import React, { Component } from 'react'
import {
  AppRegistry,
  AsyncStorage,
  Animated,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native'
import { defaultMemoize } from 'reselect'
import { getProjectsForUser } from './utils/api'
import * as colors from './utils/colors'
import Landing from './landing'
import TopBar from './top-bar'
import Login from './login'
import Dashboard from './dashboard'

const initialState = {
  canStart: false,
  token: null,
  userId: null,
  projects: {}, // normalized
  selectedProjectId: null,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default class Application extends Component {
  constructor (props) {
    super(props)

    this.state = initialState

    // Bind functions
    this.refetchProjects = this.refetchProjects.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLoginError = this.handleLoginError.bind(this)
    this.handleSelectProject = this.handleSelectProject.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentWillMount () {
    this.animatedValue = new Animated.Value(0)
    // Load cached state
    AsyncStorage.multiGet(
      [
        'token',
        'userId',
        'projects',
        'selectedProjectId',
        'activeProjectIds',
        'inactiveProjectIds',
      ],
      (error, stores) => {
        if (error) {
          console.warn('Error while reading state from storage', error)
          return
        }
        const cachedState = stores.reduce((acc, [ key, value ]) => {
          const parsedValue = JSON.parse(value)
          return {
            ...acc,
            ...(parsedValue ? { [key]: parsedValue } : {}),
          }
        }, initialState)
        const startAnimation = cachedState.token
          ? [
            Animated.spring(this.animatedValue, {
              toValue: -400,
              friction: 10,
              tension: 50,
              velocity: 1,
            }),
          ]
          : [
            Animated.spring(this.animatedValue, {
              toValue: -86,
              tension: 50,
              friction: 10,
            }),
          ]
        Animated.sequence([
          Animated.timing(this.animatedValue, {
            toValue: 0,
            duration: 1000,
          }),
          Animated.timing(this.animatedValue, {
            toValue: 50,
            duration: 200,
          }),
          ...startAnimation,
        ])
        .start(() => {
          this.setState({
            ...cachedState,
            canStart: true, // <-- this will tell the app that it can render
          })
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
      ['selectedProjectId', JSON.stringify(this.state.selectedProjectId)],
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
      selectedProjectId: activeProjects[0],
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
    this.setState({ selectedProjectId: projectId })
  }

  handleLogout () {
    this.setState({ ...initialState, canStart: true })
  }

  render () {
    const { state } = this

    const animatedStyle = { transform: [{ translateY: this.animatedValue }] }
    if (!state.canStart)
      return (
        <Landing animatedStyle={animatedStyle}/>
      )

    // Allow to access the application only if there is a token and there is
    // an active project (e.g. user has access to no projects)
    return (
      <View style={styles.container}>
        <StatusBar
          // iOS
          barStyle="light-content"
          // Android
          backgroundColor={colors.darkBlue}
          translucent={true}
        />
        <TopBar
          projects={state.projects}
          selectedProjectId={state.selectedProjectId}
          activeProjectIds={state.activeProjectIds}
          inactiveProjectIds={state.inactiveProjectIds}
          onSelectProject={this.handleSelectProject}
          onLogout={this.handleLogout}
        />
        {state.token && state.selectedProjectId
          ? (
            <Dashboard
              token={state.token}
              projects={state.projects}
              selectedProjectId={state.selectedProjectId}
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
      </View>
    )
  }
}

AppRegistry.registerComponent('CTPDashboard', () => Application)
