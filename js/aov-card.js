import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { gql, graphql } from 'react-apollo';
import moment from 'moment';
import DashboardItemPlaceholder from './dashboard-item-placeholder';
import DashboardMetricCard from './dashboard-metric-card';

const calcAvg = statistic =>
  statistic.numberOfOrders === 0
    ? 0
    : statistic.ordersValue / statistic.numberOfOrders;

class AovCard extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      orders: PropTypes.shape({
        today: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
          numberOfOrders: PropTypes.number.isRequired,
        }).isRequired,
        week: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
          numberOfOrders: PropTypes.number.isRequired,
        }).isRequired,
        month: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
          numberOfOrders: PropTypes.number.isRequired,
        }).isRequired,
        yesterday: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
          numberOfOrders: PropTypes.number.isRequired,
        }).isRequired,
        lastWeek: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
          numberOfOrders: PropTypes.number.isRequired,
        }).isRequired,
        lastMonth: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
          numberOfOrders: PropTypes.number.isRequired,
        }).isRequired,
      }),
      refetch: PropTypes.func.isRequired,
    }),
    registerRefreshListener: PropTypes.func.isRequired,
  };
  componentDidMount() {
    this.props.registerRefreshListener(() => this.props.data.refetch());
  }
  render() {
    if (this.props.data.loading)
      return <DashboardItemPlaceholder showNumberOfOrders={false} />;
    return (
      <DashboardMetricCard
        title="AOV"
        iconName="bar-chart"
        todayValue={calcAvg(this.props.data.orders.today)}
        weekValue={calcAvg(this.props.data.orders.week)}
        monthValue={calcAvg(this.props.data.orders.month)}
        yesterdayValue={calcAvg(this.props.data.orders.yesterday)}
        lastWeekValue={calcAvg(this.props.data.orders.lastWeek)}
        lastMonthValue={calcAvg(this.props.data.orders.lastMonth)}
        showNumberOfOrders={false}
        showTrend={false}
      />
    );
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
`;

export default graphql(AovFetch, {
  options: ownProps => ({
    variables: {
      target: 'dashboard',
      currency: 'EUR',
      projectKey: ownProps.projectKey,
      fromDateDay: moment().startOf('day').toISOString(),
      fromDateWeek: moment().startOf('week').toISOString(),
      fromDateMonth: moment().startOf('month').toISOString(),
      fromDateYesterday: moment()
        .subtract(1, 'day')
        .startOf('day')
        .toISOString(),
      toDateYesterday: moment().subtract(1, 'day').endOf('day').toISOString(),
      fromDateLastWeek: moment()
        .subtract(1, 'week')
        .startOf('week')
        .toISOString(),
      toDateLastWeek: moment().subtract(1, 'week').endOf('week').toISOString(),
      fromDateLastMonth: moment()
        .subtract(1, 'month')
        .startOf('month')
        .toISOString(),
      toDateLastMonth: moment()
        .subtract(1, 'month')
        .endOf('month')
        .toISOString(),
    },
  }),
})(AovCard);
