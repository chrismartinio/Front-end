import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProfileSection = (props) =>
  <View style={styles.pictureContainer}>
    {props.children}
  </View>;

const styles = StyleSheet.create({
  pictureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 1
  }
});

export { ProfileSection };
