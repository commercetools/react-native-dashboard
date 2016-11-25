/* @flow */

import React, { PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import * as colors from './utils/colors'

const styles = StyleSheet.create({
  dashboardItem: {
    margin: 8,
    padding: 8,
    backgroundColor: colors.white,
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRadius: 2,
  },
  dashboardItemTitle: {
    fontSize: 10,
    color: colors.green,
    fontWeight: '600',
  },
  dashboardItemContent: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dashboardItemContentMain: {
    flex: 1.5,
  },
  dashboardItemContentSide: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0, 0, 0, 0.1)',
    paddingLeft: 16,
  },
  dashboardItemMainMetric: {
    fontSize: 70,
    height: 75,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  dashboardItemSideMetric: {
    fontSize: 30,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  dashboardItemContentSideMetricItem: {
    paddingBottom: 8,
  },
  dashboardItemSubtext: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.4)',
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
  <View style={styles.dashboardItem}>
    <View>
      <Text style={styles.dashboardItemTitle}>
        {title.toUpperCase()}
      </Text>
    </View>
    <View style={styles.dashboardItemContent}>
      <View style={styles.dashboardItemContentMain}>
        <Text style={styles.dashboardItemMainMetric}>
          {total}
        </Text>
        <Text style={styles.dashboardItemSubtext}>
          {'Total today'.toUpperCase()}
        </Text>
      </View>
      <View style={styles.dashboardItemContentSide}>
        <View style={styles.dashboardItemContentSideMetricItem}>
          <Text style={styles.dashboardItemSideMetric}>
            {`${firstSideMetricValue}%`}
          </Text>
          <Text style={styles.dashboardItemSubtext}>
            {firstSideMetricLabel.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.dashboardItemSideMetric}>
          {`${secondSideMetricValue}%`}
        </Text>
        <Text style={styles.dashboardItemSubtext}>
          {secondSideMetricLabel.toUpperCase()}
        </Text>
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
