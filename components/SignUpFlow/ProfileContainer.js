import React from 'react';
import { View, ImageBackground } from 'react-native';
import image from '../../assets/images/profileBackground.png';

const ProfileContainer = (props) =>
  <View style={styles.containerStyle}>
    <ImageBackground
      source={image}
      style={styles.backgroundStyle}
    >
      {props.children}
    </ImageBackground>
  </View>;

const styles = {
  containerStyle: {
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    overflow: 'hidden',
  },
  backgroundStyle: {
    height: '100%',
    width: null,
    resizeMode: 'contain',
  }
};

export { ProfileContainer };
