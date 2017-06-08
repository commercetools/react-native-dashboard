/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  NativeModules,
  FlatList,
} from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { defaultMemoize } from 'reselect';
import md5 from 'blueimp-md5';
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
    borderBottomColor: colors.mainGrey,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  projects: {
    flex: 1,
    backgroundColor: colors.whiteGrey,
    borderTopColor: colors.mainGrey,
    borderTopWidth: 1,
  },
  title: {
    fontSize: 18,
    color: colors.bodyColor,
    padding: 8,
    textAlign: 'center',
  },
  item: {
    padding: 8,
    backgroundColor: colors.white,
    borderBottomColor: colors.mainGrey,
    borderBottomWidth: 1,
  },
});

const getActiveProject = defaultMemoize((projects, selectedProjectKey) =>
  projects.find(project => project.key === selectedProjectKey)
);

const ControlPanel = props => {
  const selectedProject = getActiveProject(
    props.projects,
    props.selectedProjectKey
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingLeft: 8,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: '300',
                color: colors.bodyColor,
              }}
            >
              {props.firstName}
            </Text>
          </View>
          <Avatar
            medium={true}
            rounded={true}
            source={{ uri: getGravatarUrl(props.email, 200) }}
            activeOpacity={0.7}
            containerStyle={styles.avatar}
          />
        </View>
        <View>
          <Collapsible isDefaultClosed={true}>
            {({ isOpen, toggle }) => (
              <TouchableOpacity onPress={toggle}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.bodyColor,
                    }}
                  >
                    {props.email}
                  </Text>
                  <View style={{ alignSelf: 'flex-end' }}>
                    <SimpleLineIcon name={isOpen ? 'arrow-up' : 'arrow-down'} />
                  </View>
                </View>

                {isOpen
                  ? <View
                      style={{ backgroundColor: colors.whiteGrey, padding: 8 }}
                    >
                      <Text
                        style={{
                          color: colors.blue,
                          textDecorationLine: 'underline',
                        }}
                        onPress={props.onLogout}
                      >{`Switch Account`}</Text>
                    </View>
                  : null}
              </TouchableOpacity>
            )}
          </Collapsible>
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.white,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 8,
          paddingRight: 8,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ color: colors.bodyColor, fontSize: 18 }}>
            {selectedProject.name}
          </Text>
          <Text style={{ color: colors.mainGrey, fontSize: 12 }}>
            {selectedProject.key}
          </Text>
        </View>
        <View style={{ flexGrow: 0, alignSelf: 'center' }}>
          <SimpleLineIcon name="check" color={colors.textGreen} size={20} />
        </View>
      </View>
      <View style={styles.projects}>
        <Text
          style={styles.title}
        >{`Select project (${props.projects.length})`}</Text>
        <FlatList
          style={{ flex: 1 }}
          data={props.projects}
          renderItem={({ item }) =>
            item.key !== props.selectedProjectKey &&
            <ListItem
              key={item.key}
              title={item.name}
              subtitle={(() => {
                if (item.expired) return 'The project is expired';
                if (item.suspended) return 'The project is suspended';
                return item.key;
              })()}
              rightIcon={
                <View
                  style={{
                    flex: 0.15,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <SimpleLineIcon
                    name={
                      item.expired || item.suspended ? 'minus' : 'arrow-right'
                    }
                    size={18}
                    color={colors.greyBlack}
                  />
                </View>
              }
              {...(item.expired || item.suspended
                ? {}
                : {
                    onPress: () => props.onSetProjectKey(item.key),
                  })}
              containerStyle={{
                backgroundColor: item.expired || item.suspended
                  ? colors.hoverGrey
                  : colors.white,
                paddingTop: 8,
                paddingRight: 8,
                paddingBottom: 8,
              }}
              titleStyle={{
                color: item.expired || item.suspended
                  ? colors.greyBlack
                  : colors.bodyColor,
              }}
              subtitleStyle={{
                fontSize: 12,
                fontWeight: 'normal',
                color: item.expired || item.suspended
                  ? colors.red
                  : colors.mainGrey,
              }}
              wrapperStyle={{ marginLeft: 0 }}
            />}
        />
      </View>
    </View>
  );
};
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
