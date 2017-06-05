/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Picker,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import * as colors from './utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  innerContainer: {
    backgroundColor: colors.white,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopColor: colors.grey,
    borderTopWidth: 1,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  closeButton: {
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  closeButtonText: {
    color: colors.darkBlue,
  },
});

export default class ProjectSwitcher extends Component {
  static propTypes = {
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    selectedProject: PropTypes.string.isRequired,
    // activeProjectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    // inactiveProjectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  state = {
    pendingSelectedProject: this.props.selectedProject,
  };

  handleSubmit = () => {
    this.props.onSelect(this.state.pendingSelectedProject);
  };

  handleDraftSelection = key => {
    this.setState({ pendingSelectedProject: key });
  };

  render = () => {
    const { props, state } = this;
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.closeButtonContainer}>
            <TouchableHighlight
              onPress={this.handleSubmit}
              underlayColor="transparent"
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>{'Choose'}</Text>
            </TouchableHighlight>
          </View>
          <Picker
            selectedValue={state.pendingSelectedProject}
            onValueChange={this.handleDraftSelection}
          >
            {props.projects.map(project => (
              <Picker.Item
                key={project.key}
                label={project.name}
                value={project.key}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  };
}
