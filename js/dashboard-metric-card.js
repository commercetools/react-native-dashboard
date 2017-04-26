/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
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
})

const DashboardMetricCard = props => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View>
        <Icon
          name={props.iconName}
          color={colors.darkGrey}
          size={20}
        />
      </View>
      <Text style={styles.title}>{props.title}</Text>
    </View>
    <View style={styles.content}>
      <View style={styles.row}>
        <View><Text>{'Today'}</Text></View>
        <View>{props.todayValueRenderer}</View>
      </View>
      <View style={styles.row}>
        <View><Text>{'This week'}</Text></View>
        <View>{props.weekValueRenderer}</View>
      </View>
      <View style={styles.row}>
        <View><Text>{'This month'}</Text></View>
        <View>{props.monthValueRenderer}</View>
      </View>
    </View>
  </View>
)

DashboardMetricCard.displayName = 'DashboardMetricCard'
DashboardMetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  todayValueRenderer: PropTypes.element.isRequired,
  weekValueRenderer: PropTypes.element.isRequired,
  monthValueRenderer: PropTypes.element.isRequired,
}

export default DashboardMetricCard
