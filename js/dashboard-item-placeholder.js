/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import * as colors from './utils/colors';
import Card from './card';

const DashboardItemPlaceholder = props => (
  <Card>
    <View style={{ padding: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ height: 24, flex: 0.4, backgroundColor: colors.grey }} />
        <View style={{ flex: 0.6 }} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingTop: 16,
          paddingBottom: 16,
        }}
      >
        <View style={{ height: 36, flex: 1, backgroundColor: colors.grey }} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ height: 40, flex: 0.6, backgroundColor: colors.grey }} />
        <View style={{ flex: 0.4 }} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <View style={{ height: 16, flex: 0.2, backgroundColor: colors.grey }} />
        <View style={{ flex: 0.8 }} />
      </View>
    </View>
    {props.showNumberOfOrders
      ? <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: colors.mainGrey,
            padding: 16,
          }}
        >
          <View
            style={{ height: 16, flex: 0.3, backgroundColor: colors.grey }}
          />
          <View style={{ flex: 0.6 }} />
          <View
            style={{ height: 16, flex: 0.1, backgroundColor: colors.grey }}
          />
        </View>
      : null}
  </Card>
);
DashboardItemPlaceholder.displayName = 'DashboardItemPlaceholder';
DashboardItemPlaceholder.propTypes = {
  showNumberOfOrders: PropTypes.bool,
};
DashboardItemPlaceholder.defaultProps = {
  showNumberOfOrders: true,
};

export default DashboardItemPlaceholder;
