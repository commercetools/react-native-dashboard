import PropTypes from 'prop-types';
/* @flow */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import * as colors from './utils/colors'

const styles = StyleSheet.create({
  container: {
    margin: 8,
    padding: 8,
    backgroundColor: colors.white,
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRadius: 2,
  },
  title: {
    fontSize: 10,
    color: colors.green,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentMain: {
    flex: 1.5,
  },
  contentSide: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0, 0, 0, 0.1)',
    paddingLeft: 16,
    marginLeft: 8,
  },
  contentMainMetric: {
    fontSize: 70,
    height: 75,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  sideMetric: {
    fontSize: 30,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  contentSideMetric: {
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  loadingPlaceholder: {
    backgroundColor: colors.grey,
    color: 'transparent',
  },
})

const DashboardItem = ({
  title,
  total,
  firstSideMetricValue,
  firstSideMetricLabel,
  secondSideMetricValue,
  secondSideMetricLabel,
}) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.title}>
        {title.toUpperCase()}
      </Text>
    </View>
    <View style={styles.content}>
      <View style={styles.contentMain}>
        <Text style={styles.contentMainMetric}>
          {total}
        </Text>
        <Text style={styles.subtitle}>
          {'Total today'.toUpperCase()}
        </Text>
      </View>
      <View style={styles.contentSide}>
        <View style={styles.contentSideMetric}>
          <Text style={styles.sideMetric}>
            {`${firstSideMetricValue}%`}
          </Text>
          <Text style={styles.subtitle}>
            {firstSideMetricLabel.toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.sideMetric}>
            {`${secondSideMetricValue}%`}
          </Text>
          <Text style={styles.subtitle}>
            {secondSideMetricLabel.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  </View>
)

DashboardItem.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  firstSideMetricLabel: PropTypes.string.isRequired,
  firstSideMetricValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  secondSideMetricLabel: PropTypes.string.isRequired,
  secondSideMetricValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
}

export default DashboardItem
