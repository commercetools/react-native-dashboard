/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  NativeModules,
  FlatList,
} from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import md5 from 'blueimp-md5';
import logo from '../assets/logo_color.png';
import Collapsible from './collapsible';
import * as colors from './utils/colors';

const statusBarHeight = Platform.OS === 'ios'
  ? 20
  : NativeModules.StatusBarManager.HEIGHT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: statusBarHeight,
    backgroundColor: colors.white,
  },
  'header-top': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 48,
    height: 48,
    marginLeft: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  user: {
    padding: 8,
  },
  company: {
    fontWeight: 'bold',
  },
  name: {
    paddingTop: 8,
    color: colors.bodyColor,
    fontStyle: 'italic',
  },
  email: {
    paddingTop: 8,
    color: colors.bodyColor,
  },
  link: {
    color: colors.blue,
    textDecorationLine: 'underline',
  },
  projects: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: colors.bodyColor,
    padding: 8,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 8,
    backgroundColor: colors.white,
    borderBottomColor: colors.darkGrey,
    borderBottomWidth: 1,
  },
  'item-title': {
    fontWeight: 'bold',
    color: colors.bodyColor,
  },
  'item-subtitle': {
    color: colors.bodyColor,
  },
});

const ControlPanel = props => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles['header-top']}>
        <Image source={logo} style={styles.logo} />
        <Avatar
          medium={true}
          rounded={true}
          source={{ uri: getGravatarUrl(props.email, 200) }}
          activeOpacity={0.7}
          containerStyle={styles.avatar}
        />
      </View>
      <View style={styles.user}>
        <Text style={styles.company}>{'commercetools'}</Text>
        <Collapsible isDefaultClosed={true}>
          {({ isOpen, toggle }) => (
            <TouchableOpacity onPress={toggle}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.name}>{`Hello, ${props.firstName}`}</Text>
                <View style={{ alignSelf: 'flex-end' }}>
                  <SimpleLineIcon name={isOpen ? 'arrow-up' : 'arrow-down'} />
                </View>
              </View>

              {isOpen
                ? <View>
                    <Text style={styles.email}>{props.email}</Text>
                    <Text
                      style={styles.link}
                      onPress={props.onLogout}
                    >{`Switch Account`}</Text>
                  </View>
                : null}
            </TouchableOpacity>
          )}
        </Collapsible>
      </View>
    </View>
    <View style={styles.projects}>
      <Text style={styles.title}>{`Projects (${props.projects.length})`}</Text>
      <FlatList
        style={styles.list}
        data={props.projects}
        renderItem={({ item }) => (
          <ListItem
            key={item.key}
            title={item.name}
            subtitle={item.key}
            hideChevron={item.key === props.selectedProjectKey}
            {...(item.key === props.selectedProjectKey
              ? {}
              : {
                  onPress: () => props.onSetProjectKey(item.key),
                })}
            containerStyle={{
              backgroundColor: item.key === props.selectedProjectKey
                ? colors.darkBlue
                : colors.white,
              padding: 0,
            }}
            titleStyle={{
              color: item.key === props.selectedProjectKey
                ? colors.white
                : colors.bodyColor,
            }}
            subtitleStyle={{
              color: item.key === props.selectedProjectKey
                ? colors.lightWhite
                : colors.mainGrey,
            }}
            wrapperStyle={{
              marginLeft: 0,
            }}
          />
        )}
      />
    </View>
  </View>
);
ControlPanel.displayName = 'ControlPanel';
ControlPanel.propTypes = {
  firstName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedProjectKey: PropTypes.string.isRequired,
  onSetProjectKey: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default ControlPanel;

function getGravatarUrl(email, size) {
  return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}&d=mm`;
}
