/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { intlShape, injectIntl } from 'react-intl';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { ButtonGroup } from 'react-native-elements';
import * as colors from './utils/colors';
import { formatMoney } from './utils/formats';
import Card from './card';

const styles = StyleSheet.create({
  main: {
    padding: 16,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.mainGrey,
    padding: 16,
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
    flex: 1,
    paddingTop: 16,
  },
  trend: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  'tabs-content': {
    marginTop: 16,
  },
  value: {
    fontSize: 48,
    color: colors.bodyColor,
  },
});

export class DashboardMetricCard extends React.Component {
  static displayName = 'DashboardMetricCard';
  static propTypes = {
    title: PropTypes.string.isRequired,
    iconName: PropTypes.string.isRequired,
    todayValue: PropTypes.number.isRequired,
    weekValue: PropTypes.number.isRequired,
    monthValue: PropTypes.number.isRequired,
    yesterdayValue: PropTypes.number.isRequired,
    lastWeekValue: PropTypes.number.isRequired,
    lastMonthValue: PropTypes.number.isRequired,
    numberOfOrdersToday: PropTypes.number,
    numberOfOrdersThisWeek: PropTypes.number,
    numberOfOrdersThisMonth: PropTypes.number,
    showNumberOfOrders: PropTypes.bool.isRequired,
    showTrend: PropTypes.bool.isRequired,

    // connected
    intl: intlShape.isRequired,
  };

  state = {
    selectedIndex: 0,
  };

  handleTabClick = index => {
    this.setState({ selectedIndex: index });
  };

  render = () => {
    const { props, state } = this;
    return (
      <Card>
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.title}>{props.title}</Text>
          </View>
          <View style={styles.content}>
            <ButtonGroup
              onPress={this.handleTabClick}
              selectedIndex={state.selectedIndex}
              buttons={['Today', 'This week', 'This month']}
              containerStyle={{ height: 40, marginLeft: 0, marginRight: 0 }}
            />
            <View style={styles['tabs-content']}>
              <View>
                <Text style={styles.value}>
                  {formatMoney(
                    props.intl,
                    getValueForTab(state.selectedIndex, props),
                    'EUR'
                  )}
                </Text>
              </View>
              {props.showTrend
                ? renderTrend(
                    props.intl,
                    getPreviousValueForTab(state.selectedIndex, props),
                    getValueForTab(state.selectedIndex, props)
                  )
                : null}
            </View>
          </View>
        </View>
        {props.showNumberOfOrders
          ? <View style={styles.footer}>
              <Text style={{ color: colors.greyBlack }}>{'Orders'}</Text>
              <Text style={{ color: colors.greyBlack }}>
                {getNumberOfOrdersForTab(state.selectedIndex, props)}
              </Text>
            </View>
          : null}
      </Card>
    );
  };
}

export default injectIntl(DashboardMetricCard);

function getValueForTab(tab, props) {
  switch (tab) {
    case 0:
      return props.todayValue;
    case 1:
      return props.weekValue;
    case 2:
      return props.monthValue;
    default:
      throw new Error(`Unexpected tab number ${tab}`);
  }
}

function getPreviousValueForTab(tab, props) {
  switch (tab) {
    case 0:
      return props.yesterdayValue;
    case 1:
      return props.lastWeekValue;
    case 2:
      return props.lastMonthValue;
    default:
      throw new Error(`Unexpected tab number ${tab}`);
  }
}

function getNumberOfOrdersForTab(tab, props) {
  switch (tab) {
    case 0:
      return props.numberOfOrdersToday;
    case 1:
      return props.numberOfOrdersThisWeek;
    case 2:
      return props.numberOfOrdersThisMonth;
    default:
      throw new Error(`Unexpected tab number ${tab}`);
  }
}

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
    valueColor = 'textGreen';
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
      <Text style={{ color: colors[valueColor], paddingLeft: 8 }}>
        {`${indicatorNumber}%`}
      </Text>
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
