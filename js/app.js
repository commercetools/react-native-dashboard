/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react'
import { AppRegistry } from 'react-native'
import Login from './login'

const Application = () => (
  <Login />
)
export default Application

AppRegistry.registerComponent('MerchantCenterIOSDashboard', () => Application)
