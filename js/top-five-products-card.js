import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { intlShape, injectIntl } from 'react-intl';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import DashboardItemPlaceholder from './dashboard-item-placeholder';
import * as colors from './utils/colors';
import { formatMoney } from './utils/formats';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: colors.black,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 16,
    margin: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.bodyColor,
  },
  content: {
    paddingTop: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.mainGrey,
    borderBottomWidth: 1,
  },
  name: {
    flex: 1,
  },
  index: {
    flex: 0,
    marginRight: 8,
    height: 30,
  },
  indexText: {
    color: colors.blue,
  },
  totalAmount: {
    flex: 0,
    alignItems: 'flex-end',
  },
});

class TopFiveProducts extends Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      orders: PropTypes.shape({
        topProducts: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            sku: PropTypes.string.isRequired,
            totalAmount: PropTypes.number.isRequired,
            count: PropTypes.number.isRequired,
          })
        ),
      }),
      refetch: PropTypes.func.isRequired,
    }),
    registerRefreshListener: PropTypes.func.isRequired,
    // connected
    intl: intlShape.isRequired,
  };
  componentDidMount() {
    this.props.registerRefreshListener(() => this.props.data.refetch());
  }
  render() {
    if (this.props.data.loading) return <DashboardItemPlaceholder />;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{'Top Products'}</Text>
        </View>
        <View style={styles.content}>
          {this.props.data.orders.topProducts.map((product, index) => (
            <View key={product.sku} style={styles.row}>
              <View style={styles.index}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </View>
              <View style={styles.name}>
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {product.name}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ color: colors.darkGrey, fontSize: 12 }}
                >
                  {`SKU: ${product.sku}`}
                </Text>
              </View>
              <View style={styles.totalAmount}>
                <Text>
                  {formatMoney(this.props.intl, product.totalAmount, 'EUR')}
                </Text>
                <Text style={{ color: colors.darkGrey, fontSize: 12 }}>
                  {`(${product.count})`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const WithIntl = injectIntl(TopFiveProducts);

const TopFiveProductsFetch = gql`
  query TopFiveProducts (
    $currency: String!
    $projectKey: String!
  ) {
    orders {
      topProducts (
        currency: $currency
        projectKey: $projectKey
        limit: 5
      ) {
        name(locale: "en")
        totalAmount
        sku
        count
      }
    }
  }
`;

export default graphql(TopFiveProductsFetch, {
  options: ownProps => ({
    variables: {
      target: 'dashboard',
      currency: 'EUR',
      projectKey: ownProps.projectKey,
    },
  }),
})(WithIntl);
