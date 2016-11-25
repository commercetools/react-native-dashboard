/* @flow */

import React, { PropTypes, Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Picker,
} from 'react-native'
import * as colors from './colors'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default class TopBar extends Component {
  static propTypes = {
    projects: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    selectedProjectId: PropTypes.string,
    activeProjectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    inactiveProjectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectProject: PropTypes.func.isRequired,
  }

  render () {
    const { props } = this
    return (
      <View style={styles.container}>
        <Text>{'logo'}</Text>

        <Picker
          selectedValue={props.selectedProjectId}
          onValueChange={this.onSelectProject}
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

        <Text>{'logout'}</Text>
      </View>
    )
  }
}
