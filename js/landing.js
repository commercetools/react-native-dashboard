/* @flow */

import React, { PropTypes } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Animated,
} from 'react-native'
import logo from '../assets/logo.png'
import * as colors from './colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
})

const Landing = ({ animatedStyle }) => (
  <View style={styles.container}>
    <Animated.View style={animatedStyle}>
      <Image source={logo} />
    </Animated.View>
  </View>
)
Landing.propTypes = {
  animatedStyle: PropTypes.object.isRequired,
}

export default Landing
