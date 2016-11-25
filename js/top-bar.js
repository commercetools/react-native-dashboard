/* @flow */

import React, { PropTypes, Component } from 'react'
import {
  View,
  StyleSheet,
  Picker,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import logo from '../assets/logo.png'
import * as colors from './colors'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  logo: {
    width: 20,
    height: 24,
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
    onLogout: PropTypes.func.isRequired,
  }

  render () {
    const { props } = this
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo}/>

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

        <Icon.Button
          name="logout"
          onPress={props.onLogout}
          backgroundColor="transparent"
          style={{ margin: 0, padding: 0 }}
        />
      </View>
    )
  }
}
