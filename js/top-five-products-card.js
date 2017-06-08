import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { intlShape, injectIntl } from 'react-intl';
import { gql, graphql } from 'react-apollo';
import { ListItem } from 'react-native-elements';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  static defaultProps = {
    data: {
      loading: true,
      refetch: Promise.resolve,
    },
  };
  componentDidMount() {
    this.props.registerRefreshListener(() => this.props.data.refetch());
  }
  render() {
    // TODO: define "placeholder" item for table list
    if (this.props.data.loading) return <DashboardItemPlaceholder />;
    console.log(this.props.data.orders);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{'Top 5 Products'}</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            style={{ flex: 1 }}
            data={this.props.data.orders.topProducts}
            keyExtractor={item => item.sku}
            renderItem={({ item }) => (
              <ListItem
                key={item.slug}
                leftIcon={
                  <View
                    style={{
                      flex: 0.15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {item.images.length > 0
                      ? <Image
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                          }}
                          source={{ uri: item.images[0] }}
                        />
                      : <Ionicons
                          name="ios-image-outline"
                          size={34}
                          style={{ borderRadius: 17 }}
                        />}
                  </View>
                }
                title={item.name}
                subtitle={`Revenue: ${formatMoney(this.props.intl, item.totalAmount, 'EUR')}`}
                rightIcon={
                  <View
                    style={{
                      flex: 0.15,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    <SimpleLineIcon
                      name="arrow-right"
                      size={18}
                      // TODO: change to `colors.greyBlack` once the navigation
                      // works
                      color={colors.hoverGrey}
                    />
                  </View>
                }
                onPress={() => null /* TODO: navigate to product details */}
                containerStyle={{
                  backgroundColor: colors.white,
                  paddingTop: 8,
                  paddingRight: 8,
                  paddingBottom: 8,
                }}
                titleStyle={{ color: colors.bodyColor }}
                subtitleStyle={{
                  fontSize: 12,
                  fontWeight: 'normal',
                  color: colors.mainGrey,
                }}
                wrapperStyle={{ marginLeft: 0 }}
              />
            )}
          />
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
        images
      }
    }
  }
`;

export default graphql(TopFiveProductsFetch, {
  skip: ownProps => !ownProps.projectKey,
  options: ownProps => ({
    variables: {
      target: 'dashboard',
      currency: 'EUR',
      projectKey: ownProps.projectKey,
    },
  }),
})(WithIntl);
