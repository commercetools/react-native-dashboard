/* @flow */

import React, { PropTypes } from 'react'
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
    backgroundColor: colors.green,
  },
  infoContainer: {
    flexGrow: 0,
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 24,
  },
  propertiesContainer: {
    flexGrow: 1,
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
  box: {
    flex: 1,
    margin: 8,
    padding: 8,
    backgroundColor: colors.white,
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRadius: 2,
  },
  property: {
  },
  propertyLabel: {
    color: colors.grey,
    fontWeight: 'bold',
  },
  propertyValue: {
    color: colors.darkBlue,
  },
  divider: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    marginTop: 8,
    marginBottom: 8,
  },
})

const Account = ({ user }) => (
  user ? (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getGravatarUrl(user.email) }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.nameContainer}>
          {`${user.firstName} ${user.lastName}`}
        </Text>
      </View>
      <View style={styles.propertiesContainer}>
        <View style={styles.box}>
          <View style={styles.property}>
            <Text style={styles.propertyLabel}>{'Email'}</Text>
            <Text style={styles.propertyValue}>{user.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.property}>
            <Text style={styles.propertyLabel}>{'Language'}</Text>
            <Text style={styles.propertyValue}>{user.language}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.property}>
            <Text style={styles.propertyLabel}>{'Number format'}</Text>
            <Text style={styles.propertyValue}>{user.numberFormat}</Text>
          </View>
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

function getGravatarUrl (email) {
  return `https://www.gravatar.com/avatar/${md5(email)}?s=200&d=mm`
}
