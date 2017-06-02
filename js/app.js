/* @flow */

import React, { Component } from 'react';
import {
  Animated,
  AppRegistry,
  AsyncStorage,
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { IntlProvider } from 'react-intl';
import { defaultMemoize } from 'reselect';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { getUser, getProjectsForUser } from './utils/api';
import * as colors from './utils/colors';
import Landing from './landing';
import TopBar from './top-bar';
import Login from './login';
import Dashboard from './dashboard';
import Account from './account';

// Apollo client setup
const networkInterface = createNetworkInterface({
  uri: 'https://mc.commercetools.com/graphql',
});
// Use a middleware to update the request headers with the correct params.
networkInterface.use([
  {
    /* eslint-disable no-param-reassign */
    applyMiddleware(req, next) {
      if (!req.options.headers) req.options.headers = {};
      req.options.headers['Accept'] = 'application/json';
      AsyncStorage.multiGet(['token'], (err, state) => {
        req.options.headers['Authorization'] = JSON.parse(state[0][1]);
        req.options.headers['X-Project-Key'] =
          req.request.variables['projectKey'];
        req.options.headers['X-Graphql-Target'] =
          req.request.variables['target'];
        next();
      });
    },
    /* eslint-enable no-param-reassign */
  },
]);
const client = new ApolloClient({ networkInterface });

const initialState = {
  // Used to wait for the application to render before loading the
  // cached state in case a token is already present.
  canStart: false,
  // The auth token used to authenticate the requests to the MC API.
  token: null,
  // The ID of the logged in user.
  userId: null,
  user: null,
  // A map (id -> project) of all projects that the user has access to, used
  // for the project switcher.
  projects: {}, // normalized
  // The current selected project ID from the project switcher.
  selectedProjectId: null,
  // A list of the active project IDs (not expired).
  activeProjectIds: [],
  // A list of the inactive project IDs (expired).
  inactiveProjectIds: [],
  // The error message shown in the login screen.
  loginErrorMessage: null,
  // The current active navigation tab
  navigationIndex: 0,
  // Tab definitions
  navigationRoutes: [{ key: 'dashboard' }, { key: 'account' }],
};

// Given a list of projects, return a tuple with a list of // active / inactive
// projects, based on whether the trial period is expired or not.
const selectActiveAndInactiveProjectIds = defaultMemoize(projects =>
  projects.reduce(
    (acc, project) => {
      const now = Date.now();
      const isActive =
        // Pick a project without a `trialUntil`...
        !project.trialUntil ||
        // ...or pick a project that has not expired yet
        now < new Date(project.trialUntil).getTime();
      const updatedActiveProjects = isActive
        ? acc[0].concat(project.id)
        : acc[0];
      const updatedInactiveProjects = isActive
        ? acc[1]
        : acc[1].concat(project.id);
      return [updatedActiveProjects, updatedInactiveProjects];
    },
    [
      [
        /* active */
      ],
      [
        /* inactive */
      ],
    ]
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    // Describe how the animation should look like.
    this.animatedValue = new Animated.Value(0);
    this.animatedStyle = {
      transform: [{ translateY: this.animatedValue }],
    };

    // Bind functions
    this.refetchProjects = this.refetchProjects.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLoginError = this.handleLoginError.bind(this);
    this.handleSelectProject = this.handleSelectProject.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
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
        let cachedState;
        if (error) cachedState = initialState;
        else
          cachedState = stores.reduce((acc, [key, value]) => {
            const parsedValue = JSON.parse(value);
            return {
              ...acc,
              ...(parsedValue ? { [key]: parsedValue } : {}),
            };
          }, initialState);

        const endAnimation = cachedState.token
          ? [
              // If the user is logged in, end the animation outside the screen
              Animated.spring(this.animatedValue, {
                toValue: -400,
                friction: 10,
                tension: 50,
                velocity: 1,
                useNativeDriver: true,
              }),
            ]
          : [
              // If the user is not logged in, end the animation more or less
              // in the center of the screen.
              Animated.spring(this.animatedValue, {
                // This position is where the logo will be shown in the
                // login screen.
                toValue: -88,
                friction: 10,
                tension: 50,
                useNativeDriver: true,
              }),
            ];
        // Define a sequence of animations before starting the application.
        // - wait 1sec
        // - move down
        // - end the animation (see above)
        Animated.sequence([
          Animated.timing(this.animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(this.animatedValue, {
            toValue: 50,
            duration: 200,
            useNativeDriver: true,
          }),
          ...endAnimation,
        ]).start(() => {
          this.setState(
            {
              ...cachedState,
              canStart: true, // <-- this will tell the app that it can render
            },
            () => {
              // If the user is already logged in, refetch
              // the projects to get fresh data
              if (cachedState.token) this.refetchProjects();
            }
          );
        });
      }
    );
  }

  componentDidUpdate() {
    // Persist state
    AsyncStorage.multiSet([
      ['token', JSON.stringify(this.state.token)],
      ['userId', JSON.stringify(this.state.userId)],
      ['projects', JSON.stringify(this.state.projects)],
      ['selectedProjectId', JSON.stringify(this.state.selectedProjectId)],
      ['activeProjectIds', JSON.stringify(this.state.activeProjectIds)],
      ['inactiveProjectIds', JSON.stringify(this.state.inactiveProjectIds)],
    ]);
  }

  refetchProjects() {
    const requestOptions = {
      token: this.state.token,
      userId: this.state.userId,
    };
    Promise.all([
      getUser(requestOptions),
      getProjectsForUser(requestOptions),
    ]).then(
      ([userResponse, projectsResponse]) => {
        this.handleLogin({
          token: this.state.token,
          userId: this.state.userId,
          user: userResponse,
          projects: projectsResponse,
        });
      },
      error => {
        if (this.state.token)
          // TODO: error handling
          console.error(error);
        else this.handleLoginError(error);
      }
    );
  }

  handleLogin(data) {
    const sortedProjectsByName = data.projects.sort((left, right) => {
      const a = left.name.toLowerCase();
      const b = right.name.toLowerCase();
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    const [
      activeProjects,
      inactiveProjects,
    ] = selectActiveAndInactiveProjectIds(sortedProjectsByName);

    const newState = {
      token: data.token,
      userId: data.userId,
      user: data.user,
      projects: sortedProjectsByName.reduce(
        (acc, project) => ({
          ...acc,
          [project.id]: project,
        }),
        {}
      ),
      selectedProjectId: this.state.selectedProjectId || activeProjects[0],
      activeProjectIds: activeProjects,
      inactiveProjectIds: inactiveProjects,
      loginErrorMessage: sortedProjectsByName.length > 0
        ? null
        : 'User has no projects',
    };
    this.setState(newState);
  }

  handleLoginError(error) {
    this.setState({
      loginErrorMessage: error.message,
    });
  }

  handleSelectProject(projectId) {
    this.setState({ selectedProjectId: projectId });
  }

  handleLogout() {
    this.setState({ ...initialState, canStart: true });
  }

  renderScene = ({ route }) => {
    const { state } = this;
    switch (route.key) {
      case 'dashboard':
        return (
          <Dashboard
            token={state.token}
            projects={state.projects}
            selectedProjectId={state.selectedProjectId}
          />
        );
      case 'account':
        return <Account user={state.user} />;
      default:
        return null;
    }
  };

  renderFooter = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: colors.darkBlue }}
      indicatorStyle={{ backgroundColor: colors.green }}
      // color for material ripple (Android >= 5.0 only)
      pressColor={'rgba(255,255,255,0.6)'}
      // iOS and Android < 5.0 only
      pressOpacity={0.6}
      scrollEnabled={false}
      renderIcon={({ route, focused }) => {
        let iconName;
        if (route.key === 'dashboard') iconName = 'dashboard';
        else if (route.key === 'account') iconName = 'user';
        if (!iconName) return null;

        return (
          <FontAwesomeIcon
            name={iconName}
            color={focused ? colors.green : colors.lightWhite}
            size={20}
          />
        );
      }}
    />
  );

  render() {
    const { state } = this;

    if (!state.canStart)
      // While waiting for the application to initialize, show a landing page.
      return <Landing animatedStyle={this.animatedStyle} />;

    return (
      <View style={styles.container}>
        <StatusBar
          // iOS
          barStyle="light-content"
          // Android
          backgroundColor={colors.darkBlue}
          translucent={true}
        />
        <TopBar // <-- not visible on login page
          projects={state.projects}
          selectedProjectId={state.selectedProjectId}
          activeProjectIds={state.activeProjectIds}
          inactiveProjectIds={state.inactiveProjectIds}
          onSelectProject={this.handleSelectProject}
          onLogout={this.handleLogout}
        />
        {// Allow to access the application only if the user is logged in
        // (there is a token) and there is a selected project (it might be
        // that the user has access to no projects).
        state.token && state.selectedProjectId
          ? <TabViewAnimated
              initialLayout={{
                height: 0,
                width: Dimensions.get('window').width,
              }}
              navigationState={{
                index: state.navigationIndex,
                routes: state.navigationRoutes,
                // <TabViewAnimated /> is a PureComponent. To ensure the
                // tabs will re-render if something changes in the parent
                // component state, we pass a prop value that always changes.
                // TODO: find a better solution?
                hash: Math.random(),
              }}
              renderScene={this.renderScene}
              renderFooter={this.renderFooter}
              onRequestChangeTab={index =>
                this.setState({ navigationIndex: index })}
            />
          : <Login
              onLogin={this.handleLogin}
              onLoginError={this.handleLoginError}
              errorMessage={state.loginErrorMessage}
            />}
      </View>
    );
  }
}

const AppWithApollo = props => (
  <IntlProvider
    key="intl"
    locale={'en'}
    messages={{
      /* TODO */
    }}
  >
    <ApolloProvider client={client}>
      <Application {...props} />
    </ApolloProvider>
  </IntlProvider>
);

export default AppWithApollo;

AppRegistry.registerComponent('CTPDashboard', () => AppWithApollo);
