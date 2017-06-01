/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
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
    isRefreshing: false,
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

  renderItemRow = ({ item }) => {
    const ItemComponent = item.component;
    const projectKey = this.props.projects[this.props.selectedProjectId].key
    return (
      <ItemComponent
        projectKey={projectKey}
        registerRefreshListener={this.handleRegisterRefreshListener}
      />
    );
  };

  render() {
    const { state } = this;
    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            { key: 'total-sales', data: [{ component: TotalSalesCard }] },
            { key: 'aov', data: [{ component: AovCard }] },
            { key: 'top-five-products', data: [{ component: TopFiveProducts }] },
          ]}
          renderItem={this.renderItemRow}
          refreshing={state.isRefreshing}
          onRefresh={this.handleManualRefresh}
          keyExtractor={item => item.key}
          enableVirtualization={false}
        />
      </View>
    );
  }
}
