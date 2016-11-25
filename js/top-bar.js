/* @flow */

import React, { PropTypes, Component } from 'react'
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
} from 'react-native'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import logo from '../assets/logo.png'
import ProjectSwitcher from './project-switcher'
import * as colors from './utils/colors'

const statusBarHeight = Platform.OS === 'ios'
  ? 20
  : NativeModules.StatusBarManager.HEIGHT

// TODO: find a better solution
// Get the viewport size to calculate the max width of the switcher container
// in case the text is too long.
const viewWidth = Dimensions.get('window').width
const iconLogoWidth = 20
const iconLogoutWidth = 24
const containerPadding = 8
const maxProjectSwitcherContainerWidth = (
  viewWidth -
  iconLogoWidth -
  iconLogoutWidth -
  containerPadding -
  containerPadding -
  40 // l/r space of switcher button
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: containerPadding,
    paddingRight: containerPadding,
    paddingTop: statusBarHeight,
    height: 60,
  },
  projectSwitcherButtonContainer: {
    maxWidth: maxProjectSwitcherContainerWidth,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 8,
  },
  projectSwitcherButton: {
    color: colors.white,
    marginRight: 8,
    flexWrap: 'wrap',
  },
  icon: {
    margin: 0,
    padding: 0,
    flexGrow: 0,
    flexShrink: 0,
  },
  logo: {
    width: iconLogoWidth,
    height: 24,
  },
  logout: {
    flexBasis: iconLogoutWidth,
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
    const project = props.projects[props.selectedProjectId]

    return (
      <View>
        <View style={styles.container}>
          <Image source={logo} style={[styles.icon, styles.logo]}/>

          <TouchableOpacity onPress={this.openModal}>
            <View style={styles.projectSwitcherButtonContainer}>
              <Text style={styles.projectSwitcherButton} numberOfLines={1}>
                {project ? project.name : '- - - -'}
              </Text>
              <Icon
                name="arrow-down"
                color={colors.white}
              />
            </View>
          </TouchableOpacity>

          <Icon.Button
            name="logout"
            onPress={props.onLogout}
            backgroundColor="transparent"
            iconStyle={{ marginRight: 0 }}
            style={styles.icon}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={state.isModalOpen}
          onRequestClose={this.closeModal}
        >
          <ProjectSwitcher
            {...props}
            onCloseModal={this.closeModal}
          />
        </Modal>
      </View>
    )
  }
}
