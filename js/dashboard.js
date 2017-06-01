/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListView, RefreshControl, StyleSheet, View } from 'react-native';
import TotalSalesCard from './total-sales-card';
import AovCard from './aov-card';
import TopFiveProducts from './top-five-products-card';
import * as colors from './utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green,
  },
});

export default class Dashboard extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    projects: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    selectedProjectId: PropTypes.string.isRequired,
  };

  refreshListener = [];
  pendingRefreshCount = 0;

  state = {
    projectSwitcherModalVisible: false,
    isRefreshing: false,
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    }).cloneWithRows([
      { component: TotalSalesCard },
      { component: AovCard },
      { component: TopFiveProducts },
    ]),
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedProjectId !== nextProps.selectedProjectId) {
      this.handleManualRefresh();
    }
  }

  handleManualRefresh = () => {
    this.setState({ isRefreshing: true });
    this.pendingRefreshCount = this.refreshListener.length;
    this.refreshListener.forEach(listener =>
      listener().then(this.handleRefreshFinished, this.handleRefreshFinished)
    );
  };

  handleRefreshFinished = () => {
    this.pendingRefreshCount -= 1;
    if (this.pendingRefreshCount === 0) {
      this.setState({ isRefreshing: false });
    }
  };

  handleRegisterRefreshListener = listener => {
    const length = this.refreshListener.push(listener);
    return () => {
      this.refreshListener = [
        ...this.refreshListener.slice(0, length - 1),
        ...this.refreshListener.slice(length),
      ];
    };
  };

  renderItemRow = rowData => {
    const ItemComponent = rowData.component;
    return (
      <ItemComponent
        projectKey={this.props.projects[this.props.selectedProjectId].key}
        registerRefreshListener={this.handleRegisterRefreshListener}
      />
    );
  };

  render() {
    const { state } = this;
    return (
      <View style={styles.container}>
        <ListView
          dataSource={state.dataSource}
          renderRow={this.renderItemRow}
          refreshControl={
            <RefreshControl
              refreshing={state.isRefreshing}
              onRefresh={this.handleManualRefresh}
              // iOS
              title="Loading..."
              tintColor={colors.white}
              titleColor={colors.white}
              // Android
              colors={[colors.white]}
              progressBackgroundColor={colors.white}
            />
          }
        />
      </View>
    );
  }
}
