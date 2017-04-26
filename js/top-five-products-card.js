import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'
import * as colors from './utils/colors'

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
    fontWeight: 'bold',
    paddingLeft: 8,
  },
  content: {
    paddingTop: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  totalAmountText: {
    color: colors.semiDarkGrey,
  }
})

class TopFiveProducts extends Component {
  render () {
    const { orders } = this.props.data
    console.log(orders)
    return this.props.data.loading ? <Text>Loading...</Text> : (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Icon
              name="chart"
              color={colors.darkGrey}
              size={20}
            />
          </View>
          <Text style={styles.title}>Top Products</Text>
        </View>
        <View style={styles.content}>
          {orders.topProducts.map((product, index) => (
            <View key={product.sku} style={styles.row}>
              <View style={styles.index}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </View>
              <View style={styles.name}>
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {product.name}
                </Text>
              </View>
              <View style={styles.totalAmount}>
                <Text style={styles.totalAmountText}>
                  {product.totalAmount}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

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
      }
    }
  }
`

export default graphql(TopFiveProductsFetch, {
  options: (ownProps) => ({
    variables: {
      target: 'dashboard',
      currency: 'EUR',
      projectKey: ownProps.projectKey,
    }
  })
})(TopFiveProducts)
