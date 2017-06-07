/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import * as colors from './utils/colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    shadowColor: colors.black,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: colors.white,
    borderRadius: 6,
    margin: 8,
  },
});

const Card = props => (
  <View style={styles.container}>
    {props.children}
  </View>
);
Card.displayName = 'Card';
Card.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Card;
