/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  NativeModules,
  Dimensions,
} from 'react-native';
import * as colors from './utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class ControlPanel extends Component {
  static propTypes = {
    email: PropTypes.string.isRequired,
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  render = () => (
    <View style={styles.container}>
      <View>
        <Text>{this.props.email}</Text>
      </View>
      <View>
        <Text>{'Projects'}</Text>
        {this.props.projects.map(project => (
          <View key={project.key}>
            <Text>{project.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default ControlPanel;
