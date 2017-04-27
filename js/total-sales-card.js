import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'
import DashboardMetricCard from './dashboard-metric-card'

class TotalSalesCard extends Component {
  render () {
    const { orders } = this.props.data
    return this.props.data.loading ? <Text>Loading...</Text> : (
      <DashboardMetricCard
        title="Total Sales"
        iconName="chart"
        todayValue={orders.today.ordersValue}
        weekValue={orders.week.ordersValue}
        monthValue={orders.month.ordersValue}
        yesterdayValue={orders.yesterday.ordersValue}
        lastWeekValue={orders.lastWeek.ordersValue}
        lastMonthValue={orders.lastMonth.ordersValue}
        showTrend={true}
      />
    )
  }
}

const TotalSalesFetch = gql`
  query TotalSalesFetch (
    $currency: String!
    $projectKey: String!
    $fromDateDay: String!
    $fromDateYesterday: String!
    $toDateYesterday: String!
    $fromDateWeek: String!
    $fromDateLastWeek: String!
    $toDateLastWeek: String!
    $fromDateMonth: String!
    $fromDateLastMonth: String!
    $toDateLastMonth: String!
  ) {
    orders {
      today: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateDay }
      ) {
        ordersValue
      }
      yesterday: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateYesterday to: $toDateYesterday }
      ) {
        ordersValue
      }
      week: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateWeek }
      ) {
        ordersValue
      }
      lastWeek: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateLastWeek to: $toDateLastWeek }
      ) {
        ordersValue
      }
      month: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateMonth }
      ) {
        ordersValue
      }
      lastMonth: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateLastMonth to: $toDateLastMonth }
      ) {
        ordersValue
      }
    }
  }
`

export default graphql(TotalSalesFetch, {
  options: (ownProps) => ({
    variables: {
      target: 'dashboard',
      currency: 'EUR',
      projectKey: ownProps.projectKey,
      fromDateDay: moment().startOf('day').toISOString(),
      fromDateWeek: moment().startOf('week').toISOString(),
      fromDateMonth: moment().startOf('month').toISOString(),
      fromDateYesterday: moment().subtract(1, 'day').startOf('day').toISOString(),
      toDateYesterday: moment().subtract(1, 'day').endOf('day').toISOString(),
      fromDateLastWeek: moment().subtract(1, 'week').startOf('week').toISOString(),
      toDateLastWeek: moment().subtract(1, 'week').endOf('week').toISOString(),
      fromDateLastMonth: moment().subtract(1, 'month').startOf('month').toISOString(),
      toDateLastMonth: moment().subtract(1, 'month').endOf('month').toISOString(),
    }
  })
})(TotalSalesCard)
