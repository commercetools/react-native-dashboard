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
    backgroundColor: colors.whiteGrey,
  },
});

export default class Dashboard extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    projectKey: PropTypes.string,
  };

  refreshListener = [];
  pendingRefreshCount = 0;

  state = {
    isRefreshing: false,
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.projectKey &&
      nextProps.projectKey &&
      this.props.projectKey !== nextProps.projectKey
    ) {
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
    return (
      <ItemComponent
        projectKey={this.props.projectKey}
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
            {
              key: 'top-five-products',
              data: [{ component: TopFiveProducts }],
            },
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
