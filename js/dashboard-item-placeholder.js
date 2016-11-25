/* @flow */

import React from 'react'
import {
  View,
  StyleSheet,
  Text,
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
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    height: 12,
    flex: 0.4,
    backgroundColor: colors.grey,
  },
  empty: {
    flex: 0.6,
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
    height: 75,
    backgroundColor: colors.grey,
  },
  sideMetric: {
    height: 36,
    backgroundColor: colors.grey,
  },
  contentSideMetric: {
    paddingBottom: 8,
  },
  subtitle: {
    height: 12,
    backgroundColor: colors.grey,
  },
})

const DashboardItemPlaceholder = () => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <View style={styles.title} />
      <View style={styles.empty} />
    </View>
    <View style={styles.content}>
      <View style={styles.contentMain}>
        <View style={styles.contentMainMetric} />
        <View style={styles.subtitle} />
      </View>
      <View style={styles.contentSide}>
        <View style={styles.contentSideMetric}>
          <View style={styles.sideMetric} />
          <View style={styles.subtitle} />
        </View>
        <View>
          <View style={styles.sideMetric} />
          <View style={styles.subtitle} />
        </View>
      </View>
    </View>
  </View>
)

export default DashboardItemPlaceholder
