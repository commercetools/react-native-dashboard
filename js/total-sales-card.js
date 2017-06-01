import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import DashboardItemPlaceholder from './dashboard-item-placeholder';
import DashboardMetricCard from './dashboard-metric-card';

class TotalSalesCard extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      orders: PropTypes.shape({
        today: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
        }).isRequired,
        week: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
        }).isRequired,
        month: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
        }).isRequired,
        yesterday: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
        }).isRequired,
        lastWeek: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
        }).isRequired,
        lastMonth: PropTypes.shape({
          ordersValue: PropTypes.number.isRequired,
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
    if (this.props.data.loading) return <DashboardItemPlaceholder />;
    return (
      <DashboardMetricCard
        title="Total Sales"
        iconName="bar-chart"
        todayValue={this.props.data.orders.today.ordersValue}
        weekValue={this.props.data.orders.week.ordersValue}
        monthValue={this.props.data.orders.month.ordersValue}
        yesterdayValue={this.props.data.orders.yesterday.ordersValue}
        lastWeekValue={this.props.data.orders.lastWeek.ordersValue}
        lastMonthValue={this.props.data.orders.lastMonth.ordersValue}
        showTrend={true}
      />
    );
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
`;

export default graphql(TotalSalesFetch, {
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
})(TotalSalesCard);
