/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Text, View } from 'react-native';
import Drawer from 'react-native-drawer';
import { gql, graphql } from 'react-apollo';
import * as colors from './utils/colors';
import TopBar from './top-bar';
import Dashboard from './dashboard';
import ControlPanel from './control-panel';

class ApplicationView extends Component {
  static propTypes = {
    token: PropTypes.string,
    selectedProjectKey: PropTypes.string,
    setProjectKey: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    // From Apollo
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
        }).isRequired,
      }),
    }).isRequired,
  };

  state = {
    isMenuOpen: false,
  };

  // componentWillReceiveProps = nextProps => {
  //   const prevProjectKey = this.props.data &&
  //     this.props.data.me &&
  //     this.props.data.me.project
  //     ? this.props.data.me.project.key
  //     : null;
  //   const nextProjectKey = nextProps.data &&
  //     nextProps.data.me &&
  //     nextProps.data.me.project
  //     ? nextProps.data.me.project.key
  //     : null;
  //
  //   if (nextProps.data && prevProjectKey !== nextProjectKey)
  //     nextProps.setProjectKey(nextProps.data.me.project.key);
  // };

  handleMenuClick = () => {
    this.setState({ isMenuOpen: true });
  };

  handleSetProjectKey = key => {
    this.setState({ isMenuOpen: false });
    this.props.setProjectKey(key);
  };

  renderMainView = () => {
    const { props } = this;
    if (
      props.data &&
      props.data.me &&
      props.data.me.availableProjects.length === 0
    )
      return <View><Text>{'User has no projects'}</Text></View>;

    return (
      <Dashboard token={props.token} projectKey={props.data.me.project.key} />
    );
  };

  render = () => {
    const { props, state } = this;

    if (props.data.loading)
      // TODO: render a placeholder view
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.green,
          }}
        />
      );

    const project =
      !props.data.loading &&
      props.data.me.availableProjects.find(
        p => p.key === props.data.me.project.key
      );
    return (
      <Drawer
        type="overlay"
        open={state.isMenuOpen}
        content={
          !props.data.loading &&
            <ControlPanel
              firstName={props.data.me.firstName}
              email={props.data.me.email}
              projects={props.data.me.availableProjects}
              selectedProjectKey={props.data.me.project.key}
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
            ...(state.isMenuOpen
              ? {
                  shadowColor: colors.bodyColor,
                  shadowOpacity: 0.8,
                  shadowRadius: 3,
                }
              : {}),
          },
          ...(state.isMenuOpen
            ? { mainOverlay: { backgroundColor: colors.lightBlack } }
            : {}),
        }}
      >
        <View style={{ flex: 1 }}>
          <StatusBar
            networkActivityIndicatorVisible={props.data.loading}
            // iOS
            barStyle="light-content"
            // Android
            backgroundColor={colors.darkBlue}
            translucent={true}
          />
          <TopBar
            onMenuClick={this.handleMenuClick}
            projectName={project && project.name}
          />
          {this.renderMainView()}
        </View>
      </Drawer>
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
      availableProjects { key, name, suspended, expired }
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

export default graphql(FetchLoggedInUser, {
  skip: ownProps => !ownProps.token,
  options: ownProps => ({
    // FIXME: this is necessary in order to consistently fetch user data when
    // the user logs out -> in again. If we don't do that, the user logs out,
    // then tries to log in again with a different account. At this point
    // Apollo will "see" that there is already data in the cache matching the
    // query, thus it will return the "outdated" user data.
    // Unfortunately I haven't found a proper solution to fix this problem.
    // Using `apolloClient.resetStore` doesn't work as expected, as the queries
    // will be refetched, but since the user is logged out, the requests will
    // fail.
    // Another approach would be to log in using graphql, where you pass the
    // email/password to the query. This way the cached data would be reflecting
    // the logged in user.
    fetchPolicy: 'network-only',
    variables: {
      target: 'mc',
      projectKey: ownProps.selectedProjectKey,
    },
  }),
})(ApplicationView);
