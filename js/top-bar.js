/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  NativeModules,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import * as colors from './utils/colors';

const statusBarHeight = Platform.OS === 'ios'
  ? 20
  : NativeModules.StatusBarManager.HEIGHT;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: statusBarHeight,
    height: 60,
  },
  title: {
    fontSize: 20,
    color: colors.white,
  },
});

const TopBar = props => (
  <View>
    <View style={styles.container}>
      <Icon.Button
        name="menu"
        onPress={props.onMenuClick}
        backgroundColor="transparent"
      />
      <Text style={styles.title}>{props.projectName}</Text>
    </View>
  </View>
);
TopBar.displayName = 'TopBar';
TopBar.propTypes = {
  projectName: PropTypes.string.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default TopBar;
