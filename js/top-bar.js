/* @flow */

import React, { PropTypes, Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight,
  Modal,
  Platform,
  NativeModules,
} from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import logo from '../assets/logo.png'
import Picker from './picker'
import * as colors from './colors'

const statusBarHeight = Platform.OS === 'ios'
  ? 20
  : NativeModules.StatusBarManager.HEIGHT

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingTop: statusBarHeight,
    height: 60,
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

  constructor (props) {
    super(props)

    this.state = {
      isModalOpen: false,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal () {
    this.setState({ isModalOpen: true })
  }

  closeModal () {
    this.setState({ isModalOpen: false })
  }

  render () {
    const { props, state } = this
    return (
      <View>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo}/>

          <TouchableHighlight onPress={this.openModal}>
            <Text>{'button'}</Text>
          </TouchableHighlight>

          <Icon.Button
            name="logout"
            onPress={props.onLogout}
            backgroundColor="transparent"
            style={{ margin: 0, padding: 0 }}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={state.isModalOpen}
          onRequestClose={this.closeModal}
        >
          <Picker
            {...props}
            onCloseModal={this.closeModal}
          />
        </Modal>
      </View>
    )
  }
}
