// import libraries for making a component
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

// make the component
const Header = ({ headerText }) => {
  const { viewStyle, textStyle } = styles;

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{headerText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
    paddingTop: 15
  }
});

// make the component available to other parts of the app
export { Header };
