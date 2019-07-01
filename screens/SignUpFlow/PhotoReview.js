import React from 'react';
import { Image, Text, ScrollView, StyleSheet, View, ImageBackground } from 'react-native';

class PhotoReview extends React.Component {
  constructor(props){
    super(props)
  }


  render(){
    return(


        <View style={styles.flexContainer}>
          <ImageBackground source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}} style={{width: '100%', height: '100%'}}>
            <Text>Inside kjdfhv</Text>
          </ImageBackground>
          </View>


      )
  }

}

const styles = StyleSheet.create({
  flexContainer: {
    width: '100%',
    height:'100%'
  },
  image:{

  }
})

export default PhotoReview