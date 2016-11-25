/* @flow */

import React, { PropTypes, Component } from 'react'
import {
  View,
  ListView,
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
    backgroundColor: colors.green,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const getPercentage = (a, b) => Math.round(a / b) * 100 || 0
const dashboardItemMapping = {
  orders: {
    label: 'Orders',
    firstMetricLabel: 'Open',
    secondMetricLabel: 'Complete',
    total: data => data.total,
    firstMetric: data => getPercentage(data.open / data.total),
    secondMetric: data => getPercentage(data.complete / data.total),
  },
  carts: {
    label: 'Carts',
    firstMetricLabel: 'Active',
    secondMetricLabel: 'Ordered',
    total: data => data.total,
    firstMetric: data => getPercentage(data.active / data.total),
    secondMetric: data => getPercentage(data.ordered / data.total),
  },
}

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

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = {
      projectSwitcherModalVisible: false,
      isLoading: true,
      dataSource: ds.cloneWithRows([
        {
          type: 'orders',
          data: {
            total: 0,
            open: 0,
            complete: 0,
          },
        },
        {
          type: 'carts',
          data: {
            total: 0,
            active: 0,
            ordered: 0,
          },
        },
      ]),
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
          dataSource: this.state.dataSource.cloneWithRows([
            { type: 'orders', data: response.orders },
            { type: 'carts', data: response.carts },
          ]),
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
    return (
      <View style={styles.container}>
        <Button
          title={props.projects[props.activeProjectId].name}
          color="white"
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
          <ActivityIndicator animating={true} color="white"/>
        ) : (
          <ListView
            dataSource={state.dataSource}
            renderRow={(rowData) => {
              const config = dashboardItemMapping[rowData.type]
              const data = rowData.data
              return (
                <DashboardItem
                  title={config.label}
                  total={config.total(data)}
                  firstSideMetricValue={config.firstMetric(data)}
                  firstSideMetricLabel={config.firstMetricLabel}
                  secondSideMetricValue={config.secondMetric(data)}
                  secondSideMetricLabel={config.secondMetricLabel}
                />
              )
            }}
          />
        )}
      </View>
    )
  }
}
