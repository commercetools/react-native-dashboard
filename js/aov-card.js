import React, { Component } from 'react'
import { View } from 'react-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'

const calcAvg = (statistic) => statistic.orderValue / statistic.numberOfOrders

class AovCard extends Component {
  render () {
    const { orders } = this.props.data
    return (
      <View />
      // <DashboardMetricCard
      //   title="AOV"
      //   iconName="chart"
      //   todayValue={calcAvg(orders.today)}
      //   weekValue={calcAvg(orders.week)}
      //   monthValue={calcAvg(orders.month)}
      //   yesterdayValue={calcAvg(orders.yesterday)}
      //   lastWeekValue={calcAvg(orders.lastWeek)}
      //   lastMonthValue={calcAvg(orders.lastMonth)}
      //   showTrend={true}
      // />
    )
  }
}

const AovFetch = gql`
  query AovFetch (
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
        numberOfOrders
      }
      yesterday: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateYesterday to: $toDateYesterday }
      ) {
        ordersValue
        numberOfOrders
      }
      week: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateWeek }
      ) {
        ordersValue
        numberOfOrders
      }
      lastWeek: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateLastWeek to: $toDateLastWeek }
      ) {
        ordersValue
        numberOfOrders
      }
      month: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateMonth }
      ) {
        ordersValue
        numberOfOrders
      }
      lastMonth: statistics (
        currency: $currency
        projectKey: $projectKey
        range: { from: $fromDateLastMonth to: $toDateLastMonth }
      ) {
        ordersValue
        numberOfOrders
      }
    }
  }
`

export default graphql(AovFetch, {
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
})(AovCard)
