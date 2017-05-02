import { Text } from 'react-native'
// Note: test renderer must be required after react-native.
// eslint-disable-next-line import/no-extraneous-dependencies
import renderer from 'react-test-renderer'
import React from 'react'
import { DashboardMetricCard } from './dashboard-metric-card'

const createTestProps = props => ({
  title: 'The title',
  iconName: 'bar-chart',
  todayValue: 10,
  weekValue: 20,
  monthValue: 30,
  yesterdayValue: 5,
  lastWeekValue: 10,
  lastMonthValue: 15,
  showTrend: true,
  intl: {
    formatNumber: amount => String(amount),
  },
  ...props,
})

describe('rendering', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = renderer.create(
      <DashboardMetricCard {...props} />,
    ).toJSON()
  })
  describe('with trend', () => {
    it('should render values with calculated trend', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
  describe('without trend', () => {
    beforeEach(() => {
      const props = createTestProps({ showTrend: false })
      wrapper = renderer.create(
        <DashboardMetricCard {...props} />,
      ).toJSON()
    })
    it('should render only values', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})
