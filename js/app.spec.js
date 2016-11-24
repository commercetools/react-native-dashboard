import 'react-native'
// Note: test renderer must be required after react-native.
// eslint-disable-next-line import/no-extraneous-dependencies
import renderer from 'react-test-renderer'
import React from 'react'
import Application from './app'

it('renders correctly', () => {
  renderer.create(
    <Application />,
  )
})
