import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const ActivityTag = ({ buttonStyle, textStyle, onPress, textContent = 'food'}) => {
  const { tagStyles, textStyles } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={[tagStyles, buttonStyle]}>
      <Text style={[textStyles, textStyle]}>
        { textContent }
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  tagStyles: {
    borderColor: '#007aff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1.25,
    alignSelf: 'stretch',
    marginLeft: 5,
    marginRight: 5,
  },
  textStyles: {
    color: '#007aff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
    paddingTop: 5,
    paddingBottom: 5,
  }
};

export { ActivityTag };
