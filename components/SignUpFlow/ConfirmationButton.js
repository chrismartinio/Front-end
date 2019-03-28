import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ConfirmationButton = ({ title, style, onPress }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}

    >
      <Text
        style={[textStyle, style]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#fff', //customizable
    borderColor: '#007aff', //customizable
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 25,
    borderWidth: 1.25,
    marginLeft: 35,
    marginRight: 35
  },
  textStyle: {
    color: '#007aff', //customizable
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '700',
    paddingTop: 10,
    paddingBottom: 10,
  }
});

export { ConfirmationButton };

/*
  type of button: chat -> pink
    //text style and border color = #ff1493

  back to business: blue fill, white text
    //text = #fff, backgroundColor: #007aff, borderColor: #007aff
  sign-in: blue fill, white text
    //text = #fff, backgroundColor: #007aff, borderColor: #007aff
  sign-up: blue border, blue text
    borderColor: #007aff, text color = #007aff
  sign up flow: white button, white text, purple fill
    borderColor: #fff, text color = #fff, backgroundColor: #8a2be2

*/
