/* @flow */

import React, { PropTypes, Component } from 'react'
import {
  View,
  Button,
  Picker,
  Modal,
  StyleSheet,
  Text,
} from 'react-native'
import { statistics } from './utils/api'
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
    token: PropTypes.string.isRequired,
    projects: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    activeProjectId: PropTypes.string.isRequired,
  }
  constructor (props) {
    super(props)

    this.state = {
      projectSwitcherModalVisible: false,
      isLoading: true,
      order: {
        total: 0,
        open: 0,
        complete: 0,
      },
      carts: {
        total: 0,
        open: 0,
        complete: 0,
      },
    }

    // Bind functions
    this.handleSelectProject = this.handleSelectProject.bind(this)
    this.toggleProjectSwitcherModal = this.toggleProjectSwitcherModal.bind(this)
  }
  componentDidMount () {
    const project = this.props.projects[this.props.activeProjectId]

    statistics({
      projectKey: project.key,
      token: this.props.token,
    })
    .then(
      (response) => {
        this.setState({
          orders: response.orders,
          carts: response.carts,
          isLoading: false,
        })
      },
      (error) => {
        // TODO: error handling
        console.error(error)
      },
    )
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
    const { props, state } = this
    return (
      <View>
        <Button
          title={props.projects[props.activeProjectId].name}
          color={colors.green}
          onPress={this.toggleProjectSwitcherModal}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={state.projectSwitcherModalVisible}
          style={styles.modal}
        >
          <Picker
            selectedValue={props.activeProjectId}
            onValueChange={this.handleSelectProject}>
            {Object.values(props.projects).map(project => (
              <Picker.Item
                key={project.id}
                label={project.name}
                value={project.id}
              />
            ))}
          </Picker>
        </Modal>

        <View>
          <Text>{JSON.stringify(this.state)}</Text>
        </View>
      </View>
    )
  }
}
