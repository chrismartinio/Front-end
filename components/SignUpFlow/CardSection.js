import React from 'react';
import { View } from 'react-native';

const CardSection = (props) =>
  <View style={styles.containerStyle}>
    {props.children}
  </View>;

const styles = {
  containerStyle: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',

  }
};

export { CardSection };
