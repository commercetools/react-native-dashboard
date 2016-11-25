/* @flow */

import React from 'react'
import {
  View,
  Image,
  StyleSheet,
} from 'react-native'
import logo from '../assets/logo.png'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const Landing = () => (
  <View style={styles.container}>
    <Image source={logo} />
  </View>
)

export default Landing
