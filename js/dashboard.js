import PropTypes from 'prop-types';
/* @flow */

import React, { Component } from 'react';
import {
  ListView,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import { defaultMemoize } from 'reselect'
import DashboardItem from './dashboard-item'
import TotalSalesCard from './total-sales-card'
import AovCard from './aov-card'
import TopFiveProducts from './top-five-products-card'
import DashboardItemPlaceholder from './dashboard-item-placeholder'
import { getStatisticsForThisWeek } from './utils/api'
import * as colors from './utils/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green,
  },
})

const getPercentage = defaultMemoize((fraction, total) => {
  if (!fraction || !total)
    return 0
  const percentage = (fraction / total) * 100
  if (Math.round(percentage) !== percentage)
    return percentage.toFixed(2)
  return percentage
})
const dashboardItemMapping = {
  orders: {
    label: 'Orders',
    firstMetricLabel: 'Open',
    secondMetricLabel: 'Complete',
    total: data => data.reduce(
      (acc, stat) => acc + stat.total,
      0,
    ),
    firstMetric: (data) => {
      const total = data.reduce(
        (acc, stat) => acc + stat.total,
        0,
      )
      const open = data.reduce(
        (acc, stat) => acc + stat.open,
        0,
      )
      return getPercentage(open, total)
    },
    secondMetric: (data) => {
      const total = data.reduce(
        (acc, stat) => acc + stat.total,
        0,
      )
      const complete = data.reduce(
        (acc, stat) => acc + stat.complete,
        0,
      )
      return getPercentage(complete, total)
    },
  },
  carts: {
    label: 'Carts',
    firstMetricLabel: 'Active',
    secondMetricLabel: 'Ordered',
    total: data => data.reduce(
      (acc, stat) => acc + stat.total,
      0,
    ),
    firstMetric: (data) => {
      const total = data.reduce(
        (acc, stat) => acc + stat.total,
        0,
      )
      const active = data.reduce(
        (acc, stat) => acc + stat.active,
        0,
      )
      return getPercentage(active, total)
    },
    secondMetric: (data) => {
      const total = data.reduce(
        (acc, stat) => acc + stat.total,
        0,
      )
      const ordered = data.reduce(
        (acc, stat) => acc + stat.ordered,
        0,
      )
      return getPercentage(ordered, total)
    },
  },
}

export default class Dashboard extends Component {

  static propTypes = {
    token: PropTypes.string.isRequired,
    projects: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    selectedProjectId: PropTypes.string.isRequired,
  }

  refreshListener = [];
  pendingRefreshCount = 0;

  state = {
    projectSwitcherModalVisible: false,
    isRefreshing: false,
    dataSource: new ListView
      .DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      })
      .cloneWithRows([
        { component: TotalSalesCard },
        { component: AovCard },
        { component: TopFiveProducts },
      ]),
  };

  componentWillReceiveProps (nextProps) {
    if (this.props.selectedProjectId !== nextProps.selectedProjectId) {
      this.handleManualRefresh()
    }
  }

  handleManualRefresh = () => {
    this.setState({ isRefreshing: true })
    this.pendingRefreshCount = this.refreshListener.length
    this.refreshListener.forEach(listener =>
      listener().then(this.handleRefreshFinished, this.handleRefreshFinished)
    )
  }

  handleRefreshFinished = () => {
    this.pendingRefreshCount -= 1
    if (this.pendingRefreshCount === 0) {
      this.setState({ isRefreshing: false })
    }
  }

  handleRegisterRefreshListener = (listener) => {
    const length = this.refreshListener.push(listener)
    return () => {
      this.refreshListener = [
        ...this.refreshListener.slice(0, length - 1),
        ...this.refreshListener.slice(length),
      ]
    }
  }

  renderItemRow = (rowData) => {
    const Component = rowData.component
    return (
      <Component
        projectKey={this.props.projects[this.props.selectedProjectId].key}
        registerRefreshListener={this.handleRegisterRefreshListener}
      />
    )
  }

  render () {
    const { state } = this
    return (
      <View style={styles.container}>
        <ListView
          dataSource={state.dataSource}
          renderRow={this.renderItemRow}
          refreshControl={(
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
          )}
        />
      </View>
    )
  }
}
