import React from 'react';
import { View, Image } from 'react-native';

//take a user picture and display it on the field
const ProfilePicture = ({ height, width, radius }) =>
  <View style={styles.containerStyles}>
    <Image
      source={{ uri: 'https://images-na.ssl-images-amazon.com/images/I/61McsadO1OL.jpg' }}
      style={styles.imageStyles}
      height={height || 280}
      width={width || 280}
      borderRadius={radius || 140}
    />
  </View>;

const styles = StyleSheet.create({
  imageStyles: {
    justifyContent: 'space-around',
  }
});

export { ProfilePicture };
