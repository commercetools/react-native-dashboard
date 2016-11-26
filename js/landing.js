/* @flow */

import React, { PropTypes } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Animated,
} from 'react-native'
import logo from '../assets/logo_2x.png'
import * as colors from './utils/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  logo: {
    width: 100,
    height: 100,
  },
})

const Landing = ({ animatedStyle }) => (
  <View style={styles.container}>
    <Animated.View style={animatedStyle}>
      <Image
        source={logo}
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  </View>
)
Landing.propTypes = {
  animatedStyle: PropTypes.object.isRequired,
}

export default Landing
