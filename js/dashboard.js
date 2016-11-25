/* @flow */

import React, { PropTypes, Component } from 'react'
import {
  View,
  Button,
  Picker,
  Modal,
  StyleSheet,
} from 'react-native'
import * as colors from './colors'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default class Dashboard extends Component {
  static propTypes = {
    projects: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    activeProjectId: PropTypes.string.isRequired,
  }
  constructor () {
    super()
    this.state = {
      projectSwitcherModalVisible: false,
    }
    this.handleSelectProject = this.handleSelectProject.bind(this)
    this.toggleProjectSwitcherModal = this.toggleProjectSwitcherModal.bind(this)
  }
  handleSelectProject () {
    // TODO
    this.toggleProjectSwitcherModal()
  }
  toggleProjectSwitcherModal () {
    this.setState(prevState => ({
      projectSwitcherModalVisible: !prevState.projectSwitcherModalVisible,
    }))
  }
  render () {
    return (
      <View>
        <Button
          title={this.props.projects[this.props.activeProjectId].name}
          color={colors.green}
          onPress={this.toggleProjectSwitcherModal}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.projectSwitcherModalVisible}
          style={styles.modal}
        >
          <Picker
            selectedValue={this.props.activeProjectId}
            onValueChange={this.handleSelectProject}>
            {Object.values(this.props.projects).map(project => (
              <Picker.Item
                key={project.id}
                label={project.name}
                value={project.id}
              />
            ))}
          </Picker>
        </Modal>
      </View>
    )
  }
}
