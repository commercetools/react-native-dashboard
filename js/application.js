/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  // Dimensions,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Drawer from 'react-native-drawer';
// import { TabViewAnimated, TabBar } from 'react-native-tab-view';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { gql, graphql } from 'react-apollo';
import * as colors from './utils/colors';
import Landing from './landing';
import TopBar from './top-bar';
import Login from './login';
import Dashboard from './dashboard';
import ControlPanel from './control-panel';
// import Account from './account';
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

  toggleMenu = () => {
    if (this._drawer._open)
      this._drawer.close()
    else
      this._drawer.open()
  };

  // renderScene = ({ route }) => {
  //   const { props } = this;
  //   switch (route.key) {
  //     case 'dashboard':
  //       return (
  //         <Dashboard
  //           token={props.token}
  //           projectKey={props.selectedProjectKey}
  //         />
  //       );
  //     case 'account':
  //       return <Account user={props.data.me} />;
  //     default:
  //       return null;
  //   }
  // };
  //
  // renderFooter = props => (
  //   <TabBar
  //     {...props}
  //     style={{ backgroundColor: colors.darkBlue }}
  //     indicatorStyle={{ backgroundColor: colors.green }}
  //     // color for material ripple (Android >= 5.0 only)
  //     pressColor={'rgba(255,255,255,0.6)'}
  //     // iOS and Android < 5.0 only
  //     pressOpacity={0.6}
  //     scrollEnabled={false}
  //     renderIcon={({ route, focused }) => {
  //       let iconName;
  //       if (route.key === 'dashboard') iconName = 'dashboard';
  //       else if (route.key === 'account') iconName = 'user';
  //       if (!iconName) return null;
  //
  //       return (
  //         <FontAwesomeIcon
  //           name={iconName}
  //           color={focused ? colors.green : colors.lightWhite}
  //           size={20}
  //         />
  //       );
  //     }}
  //   />
  // );

  render = () => {
    const { props, state } = this;
    if (state.isAnimating)
      return <Landing animatedStyle={this.animatedStyle} />;

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
        {props.token && props.selectedProjectKey
          ? <TopBar // <-- not visible on login page
              toggleMenu={this.toggleMenu}
              projects={props.data.me.availableProjects}
              selectedProject={props.selectedProjectKey}
              // activeProjectIds={state.activeProjectIds}
              // inactiveProjectIds={state.inactiveProjectIds}
              onSelectProject={props.setProjectKey}
              onLogout={props.logout}
            />
          : null}
        {// Allow to access the application only if the user is logged in
        // (there is a token) and there is a selected project (it might be
        // that the user has access to no projects).
        props.token && props.selectedProjectKey
          ? <Drawer
              type="overlay"
              ref={ref => (this._drawer = ref)}
              content={
                <ControlPanel
                  projects={props.data.me.availableProjects}
                  email={props.data.me.email}
                />
              }
              tapToClose={true}
              openDrawerOffset={0.2} // 20% gap on the right side of drawer
              closedDrawerOffset={0}
              // tweenHandler={Drawer.tweenPresets.parallax}
              // tweenHandler={(ratio) => ({
              //   main: { opacity:(2-ratio)/2 }
              // })}
              styles={{
                drawer: {
                  flex: 1,
                  backgroundColor: colors.mainGrey,
                  borderRightColor: colors.darkGrey,
                  borderRightWidth: 1,
                  padding: 8,
                },
                // main: { padding: 16 },
              }}
            >
              <Dashboard
                token={props.token}
                projectKey={props.selectedProjectKey}
              />
            </Drawer>
          : // ? <TabViewAnimated
            //     initialLayout={{
            //       height: 0,
            //       width: Dimensions.get('window').width,
            //     }}
            //     navigationState={{
            //       index: state.navigationIndex,
            //       routes: state.navigationRoutes,
            //       // <TabViewAnimated /> is a PureComponent. To ensure the
            //       // tabs will re-render if something changes in the parent
            //       // component state, we pass a prop value that always changes.
            //       // TODO: find a better solution?
            //       hash: Math.random(),
            //     }}
            //     renderScene={this.renderScene}
            //     renderFooter={this.renderFooter}
            //     onRequestChangeTab={index =>
            //       this.setState({ navigationIndex: index })}
            //   />
            <Login
              onLogin={props.setToken}
              errorMessage={
                props.data &&
                  props.data.me &&
                  props.data.me.availableProjects.length === 0
                  ? 'User has no projects'
                  : ''
              }
            />}
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
