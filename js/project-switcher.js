import PropTypes from 'prop-types';
/* @flow */

import React, { Component } from 'react';
import {
  Picker,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import * as colors from './utils/colors'

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
})

export default class ProjectSwitcher extends Component {

  static propTypes = {
    projects: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    selectedProjectId: PropTypes.string,
    activeProjectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    inactiveProjectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      currentProjectSelectedId: props.selectedProjectId,
    }

    // Bind functions
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDraftSelection = this.handleDraftSelection.bind(this)
  }

  handleSubmit () {
    this.props.onSelect(this.state.currentProjectSelectedId)
  }

  handleDraftSelection (id) {
    this.setState({ currentProjectSelectedId: id })
  }

  render () {
    const { props, state } = this
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
            selectedValue={state.currentProjectSelectedId}
            onValueChange={this.handleDraftSelection}
          >
            {props.activeProjectIds.map((projectId) => {
              const project = props.projects[projectId]
              // TODO: show inactive projects
              return (
                <Picker.Item
                  key={project.id}
                  label={project.name}
                  value={project.id}
                />
              )
            })}
          </Picker>
        </View>
      </View>
    )
  }
}
