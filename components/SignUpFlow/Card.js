import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = (props) =>
  <View style={styles.containerStyle}>
    {props.children}
  </View>;


const styles = StyleSheet.create({
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: '#fff'
  }
});

export { Card };
