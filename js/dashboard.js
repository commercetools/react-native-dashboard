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

const getPercentage = (a, b) => Math.round(a / b) * 100 || 0

export default class Dashboard extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    projects: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    activeProjectId: PropTypes.string.isRequired,
    activeProjectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    inactiveProjectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
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

    // Get the data
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
    const openOrders = getPercentage(state.orders.open / state.orders.total)
    const completedOrders = getPercentage(
      state.orders.complete / state.orders.total,
    )
    const activeCarts = getPercentage(state.carts.active / state.carts.total)
    const orderedCarts = getPercentage(
      state.carts.ordered / state.carts.total,
    )
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
            onValueChange={this.handleSelectProject}
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
