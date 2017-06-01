/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { intlShape, injectIntl } from 'react-intl';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
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
  values: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  trend: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
  money: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export const DashboardMetricCard = props => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View>
        <FontAwesomeIcon
          name={props.iconName}
          color={colors.darkGrey}
          size={20}
        />
      </View>
      <Text style={styles.title}>{props.title}</Text>
    </View>
    <View style={styles.content}>
      <View style={styles.row}>
        <View style={styles.grow}><Text>{'Today'}</Text></View>
        <View style={styles.values}>
          <View style={styles.money}>
            <Text>{formatMoney(props.intl, props.todayValue, 'EUR')}</Text>
          </View>
          {props.showTrend
            ? renderTrend(props.intl, props.yesterdayValue, props.todayValue)
            : null}
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.grow}><Text>{'This week'}</Text></View>
        <View style={styles.values}>
          <View style={styles.money}>
            <Text>{formatMoney(props.intl, props.weekValue, 'EUR')}</Text>
          </View>
          {props.showTrend
            ? renderTrend(props.intl, props.lastWeekValue, props.weekValue)
            : null}
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.grow}><Text>{'This month'}</Text></View>
        <View style={styles.values}>
          <View style={styles.money}>
            <Text>{formatMoney(props.intl, props.monthValue, 'EUR')}</Text>
          </View>
          {props.showTrend
            ? renderTrend(props.intl, props.lastMonthValue, props.monthValue)
            : null}
        </View>
      </View>
    </View>
  </View>
);

DashboardMetricCard.displayName = 'DashboardMetricCard';
DashboardMetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  todayValue: PropTypes.number.isRequired,
  weekValue: PropTypes.number.isRequired,
  monthValue: PropTypes.number.isRequired,
  yesterdayValue: PropTypes.number.isRequired,
  lastWeekValue: PropTypes.number.isRequired,
  lastMonthValue: PropTypes.number.isRequired,
  showTrend: PropTypes.bool.isRequired,

  // connected
  intl: intlShape.isRequired,
};

export default injectIntl(DashboardMetricCard);

function renderTrend(intl, prevValue, nextValue) {
  if (prevValue === 0)
    return (
      <View style={styles.trend}>
        <Text style={{ color: colors.darkGrey }}>{'N/A'}</Text>
      </View>
    );

  const indicatorNumber = calculateIndicatorNumber(prevValue, nextValue);

  let valueColor;
  let valueIcon;
  if (indicatorNumber < 0) {
    valueColor = 'red';
    valueIcon = 'arrow-down';
  } else if (indicatorNumber >= 0) {
    valueColor = 'green';
    valueIcon = 'arrow-up';
  }

  if (!valueIcon)
    return (
      <View style={styles.trend}>
        <Text style={{ color: colors.darkGrey }}>{'N/A'}</Text>
      </View>
    );

  return (
    <View style={styles.trend}>
      <SimpleLineIcon name={valueIcon} color={colors[valueColor]} size={10} />
      <Text style={{ color: colors[valueColor] }}>{`${indicatorNumber}%`}</Text>
    </View>
  );
}

function calculateIndicatorNumber(oldVal, newVal) {
  const diffPercentage = (newVal - oldVal) / oldVal * 100;

  // Check if the calculated value has decimal places.
  // If so returns the value fixed to 2 decimals.
  if (Math.round(diffPercentage) === diffPercentage) return diffPercentage;

  return diffPercentage.toFixed(2);
}
