/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { gql, graphql } from 'react-apollo';
import * as colors from './utils/colors';
import Landing from './landing';
import TopBar from './top-bar';
import Login from './login';
import Dashboard from './dashboard';
import ControlPanel from './control-panel';
import withApplicationState from './with-application-state';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Application extends Component {
  static propTypes = {
    token: PropTypes.string,
    selectedProjectKey: PropTypes.string,
    setToken: PropTypes.func.isRequired,
    setProjectKey: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      me: PropTypes.shape({
        availableProjects: PropTypes.arrayOf(
          PropTypes.shape({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          })
        ).isRequired,
        project: PropTypes.shape({
          key: PropTypes.string.isRequired,
        }),
      }),
    }),
  };

  state = {
    isAnimating: true,
    isMenuOpen: false,
    // The current active navigation tab
    navigationIndex: 0,
    // Tab definitions
    navigationRoutes: [{ key: 'dashboard' }, { key: 'account' }],
  };

  animatedValue = new Animated.Value(0);
  animatedStyle = { transform: [{ translateY: this.animatedValue }] };

  componentDidMount = () => {
    const endAnimation = this.props.token
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
      this.setState({ isAnimating: false });
    });
  };

  componentWillReceiveProps = nextProps => {
    const prevProjectKey = this.props.data &&
      this.props.data.me &&
      this.props.data.me.project
      ? this.props.data.me.project.key
      : null;
    const nextProjectKey = nextProps.data &&
      nextProps.data.me &&
      nextProps.data.me.project
      ? nextProps.data.me.project.key
      : null;

    if (nextProps.data && prevProjectKey !== nextProjectKey)
      nextProps.setProjectKey(nextProps.data.me.project.key);
  };

  handleMenuClick = () => {
    this.setState({ isMenuOpen: true });
  };

  handleSetProjectKey = (key) => {
    this.setState({ isMenuOpen: false })
    this.props.setProjectKey(key)
  };

  render = () => {
    const { props, state } = this;
    if (state.isAnimating)
      return <Landing animatedStyle={this.animatedStyle} />;

    if (props.token && props.selectedProjectKey) {
      const project = props.data.me.availableProjects.find(
        p => p.key === props.selectedProjectKey
      );
      return (
        <Drawer
          type="overlay"
          open={state.isMenuOpen}
          content={
            <ControlPanel
              firstName={props.data.me.firstName}
              email={props.data.me.email}
              projects={props.data.me.availableProjects}
              selectedProjectKey={props.selectedProjectKey}
              onSetProjectKey={this.handleSetProjectKey}
              onLogout={props.logout}
            />
          }
          tapToClose={true}
          onClose={() => this.setState({ isMenuOpen: false })}
          openDrawerOffset={0.2} // 20% gap on the right side of drawer
          closedDrawerOffset={0}
          tweenDuration={150}
          tweenEasing="easeInOutSine"
          styles={{
            drawer: {
              flex: 1,
              backgroundColor: colors.whiteGrey,
              borderRightColor: colors.darkGrey,
              borderRightWidth: 1,
              shadowColor: colors.bodyColor,
              shadowOpacity: 0.8,
              shadowRadius: 3,
            },
            ...(state.isMenuOpen
              ? { mainOverlay: { backgroundColor: colors.lightBlack } }
              : {}),
          }}
        >
          <View style={styles.container}>
            <StatusBar
              networkActivityIndicatorVisible={props.data && props.data.loading}
              // iOS
              barStyle="light-content"
              // Android
              backgroundColor={colors.darkBlue}
              translucent={true}
            />
            <TopBar
              onMenuClick={this.handleMenuClick}
              projectName={project.name}
            />
            <Dashboard
              token={props.token}
              projectKey={props.selectedProjectKey}
            />
          </View>
        </Drawer>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar
          networkActivityIndicatorVisible={props.data && props.data.loading}
          // iOS
          barStyle="light-content"
          // Android
          backgroundColor={colors.darkBlue}
          translucent={true}
        />
        <Login
          onLogin={props.setToken}
          errorMessage={
            props.data &&
              props.data.me &&
              props.data.me.availableProjects.length === 0
              ? 'User has no projects'
              : ''
          }
        />
      </View>
    );
  };
}

const FetchLoggedInUser = gql`
  query LoggedInUser ($projectKey: String) {
    me {
      email
      firstName
      lastName
      language
      numberFormat
      availableProjects { key, name }
      project (key: $projectKey) {
        key
        name
        currencies
        languages
        expired
        suspended
        permissions {
          canManageOrganization
          canManageProject
          canViewProjectSettings
          canViewProducts
          canManageProducts
          canViewOrders
          canManageOrders
          canViewCustomers
          canManageCustomers
          canViewTypes
          canManageTypes
          canViewShippingLists
          canManageShippingLists
          canViewPayments
          canManagePayments
        }
      }
    }
  }
`;

const WithApollo = graphql(FetchLoggedInUser, {
  skip: ownProps => !ownProps.token,
  options: ownProps => ({
    variables: {
      target: 'mc',
      projectKey: ownProps.selectedProjectKey,
    },
  }),
})(Application);
export default withApplicationState(WithApollo);
