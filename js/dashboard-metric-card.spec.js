import { Text } from 'react-native'
// Note: test renderer must be required after react-native.
// eslint-disable-next-line import/no-extraneous-dependencies
import renderer from 'react-test-renderer'
import React from 'react'
import DashboardMetricCard from './dashboard-metric-card'

const createTestProps = props => ({
  title: 'The title',
  iconName: 'chart',
  todayValue: (<Text>{'€ 123'}</Text>),
  weekValue: (<Text>{'€ 123'}</Text>),
  monthValue: (<Text>{'€ 123'}</Text>),
  ...props,
})

describe('rendering', () => {
  let props
  let jsonTree
  beforeEach(() => {
    props = createTestProps()
    jsonTree = renderer.create(
      <DashboardMetricCard {...props} />,
    ).toJSON()
  })
  it('should render title', () => {
    expect(jsonTree).toMatchSnapshot()
  })
})
