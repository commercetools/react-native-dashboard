/* @flow */

import React, { PropTypes, Component } from 'react'
import {
  ListView,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import { defaultMemoize } from 'reselect'
import DashboardItem from './dashboard-item'
import DashboardItemPlaceholder from './dashboard-item-placeholder'
import { getStatisticsForToday } from './utils/api'
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
    total: data => data.total,
    firstMetric: data => getPercentage(data.open, data.total),
    secondMetric: data => getPercentage(data.complete, data.total),
  },
  carts: {
    label: 'Carts',
    firstMetricLabel: 'Active',
    secondMetricLabel: 'Ordered',
    total: data => data.total,
    firstMetric: data => getPercentage(data.active, data.total),
    secondMetric: data => getPercentage(data.ordered, data.total),
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

  constructor (props) {
    super(props)

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = {
      projectSwitcherModalVisible: false,
      isLoading: true,
      isRefreshing: false,
      dataSource: ds.cloneWithRows([
        {
          type: 'orders',
          data: {
            total: 0,
            open: 0,
            complete: 0,
          },
        },
        {
          type: 'carts',
          data: {
            total: 0,
            active: 0,
            ordered: 0,
          },
        },
      ]),
    }

    // Bind functions
    this.handleManualRefresh = this.handleManualRefresh.bind(this)
    this.renderItemRow = this.renderItemRow.bind(this)
  }

  componentDidMount () {
    this.fetchProjectStatistics(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.selectedProjectId !== nextProps.selectedProjectId) {
      this.setState({ isLoading: true })
      this.fetchProjectStatistics(nextProps)
    }
  }

  fetchProjectStatistics (props) {
    const project = props.projects[props.selectedProjectId]

    // Get the data
    getStatisticsForToday({
      projectKey: project.key,
      token: props.token,
    })
    .then(
      (response) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows([
            { type: 'orders', data: response.orders },
            { type: 'carts', data: response.carts },
          ]),
          isLoading: false,
          isRefreshing: false,
        })
      },
      (error) => {
        // TODO: error handling
        console.error(error)
      },
    )
  }

  handleManualRefresh () {
    this.setState({ isRefreshing: true })
    this.fetchProjectStatistics(this.props)
  }

  renderItemRow (rowData) {
    const config = dashboardItemMapping[rowData.type]
    const data = rowData.data

    // Show a placeholder item while data is being loaded.
    return this.state.isLoading
      ? (<DashboardItemPlaceholder />)
      : (
        <DashboardItem
          title={config.label}
          total={config.total(data)}
          firstSideMetricValue={config.firstMetric(data)}
          firstSideMetricLabel={config.firstMetricLabel}
          secondSideMetricValue={config.secondMetric(data)}
          secondSideMetricLabel={config.secondMetricLabel}
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
