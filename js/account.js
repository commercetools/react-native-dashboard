import PropTypes from 'prop-types';
/* @flow */

import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import md5 from 'blueimp-md5'
import * as colors from './utils/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
  },
  infoContainer: {
    flexGrow: 0,
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  propertiesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nameContainer: {
    marginTop: 24,
    fontSize: 20,
    textAlign: 'center',
    color: colors.darkBlue,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  property: {
    paddingBottom: 8,
  },
  propertyLabel: {
    color: colors.darkGrey,
    fontSize: 12,
  },
  propertyValue: {
    color: colors.darkBlue,
  },
})

const Account = ({ user }) => (
  user ? (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getGravatarUrl(user.email, 200) }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.nameContainer}>
          {`${user.firstName} ${user.lastName}`}
        </Text>
      </View>
      <View style={styles.propertiesContainer}>
        <View style={styles.property}>
          <Text style={styles.propertyLabel}>{'Email'}</Text>
          <Text style={styles.propertyValue}>{user.email}</Text>
        </View>
        <View style={styles.property}>
          <Text style={styles.propertyLabel}>{'Language'}</Text>
          <Text style={styles.propertyValue}>{user.language}</Text>
        </View>
        <View style={styles.property}>
          <Text style={styles.propertyLabel}>{'Number format'}</Text>
          <Text style={styles.propertyValue}>{user.numberFormat}</Text>
        </View>
        <View style={styles.property}>
          <Text style={styles.propertyLabel}>{'Time zone'}</Text>
          <Text style={styles.propertyValue}>{user.timeZone || '-'}</Text>
        </View>
      </View>
    </View>
  ) : (<Text />)
)
Account.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    numberFormat: PropTypes.string.isRequired,
  }),
}

export default Account

function getGravatarUrl (email, size) {
  return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}&d=mm`
}
