/* @flow */

import React, { PropTypes, Component } from 'react'
import {
  View,
  Button,
  Picker,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import DashboardItem from './dashboard-item'
import { statistics } from './utils/api'
import * as colors from './colors'

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
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
    onSelectProject: PropTypes.func.isRequired,
  }
  constructor (props) {
    super(props)

    this.state = {
      projectSwitcherModalVisible: false,
      isLoading: true,
      orders: {
        total: 0,
        open: 0,
        complete: 0,
      },
      carts: {
        total: 0,
        active: 0,
        ordered: 0,
      },
    }

    // Bind functions
    this.handleSelectProject = this.handleSelectProject.bind(this)
    this.toggleProjectSwitcherModal = this.toggleProjectSwitcherModal.bind(this)
  }
  componentDidMount () {
    this.fetchProjectStatistics()
  }
  componentDidUpdate (prevProps) {
    if (prevProps.activeProjectId !== this.props.activeProjectId)
      this.fetchProjectStatistics()
  }
  fetchProjectStatistics () {
    const project = this.props.projects[this.props.activeProjectId]
    this.setState({ isLoading: true })
    statistics({
      projectKey: 'coeur-production',
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
        // console.error(error)
      },
    )
  }
  handleSelectProject (projectId) {
    this.props.onSelectProject(projectId)
    this.toggleProjectSwitcherModal()
  }
  toggleProjectSwitcherModal () {
    this.setState(prevState => ({
      projectSwitcherModalVisible: !prevState.projectSwitcherModalVisible,
    }))
  }
  render () {
    const { props, state } = this
    const openOrders = Math.round(state.orders.open / state.orders.total) * 100
    const completedOrders = Math.round(
      state.orders.complete / state.orders.total,
    ) * 100
    const activeCarts = Math.round(state.carts.active / state.carts.total) * 100
    const orderedCarts = Math.round(
      state.carts.ordered / state.carts.total,
    ) * 100
    return (
      <View style={styles.container}>
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
        {state.isLoading ? (
          <ActivityIndicator animating={true}/>
        ) : (
          <View>
            <DashboardItem
              title="Orders"
              total={state.orders.total}
              firstSideMetricValue={openOrders}
              firstSideMetricLabel={'Open'}
              secondSideMetricValue={completedOrders}
              secondSideMetricLabel={'Complete'}
            />
            <DashboardItem
              title="Carts"
              total={state.carts.total}
              firstSideMetricValue={activeCarts}
              firstSideMetricLabel={'Active'}
              secondSideMetricValue={orderedCarts}
              secondSideMetricLabel={'Ordered'}
            />
          </View>
        )}
      </View>
    )
  }
}
