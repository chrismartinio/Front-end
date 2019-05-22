import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';

const styles = StyleSheet.create({
  ImageBackground:{
    height:'100%',
    width:'100%'
  }
})


class ViewReply extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <View>
        <ImageBackground style={styles.ImageBackground} source={require('../../assets/Assets_V1/Butterfly_Background/butterflyBackground.png')}>

          <Text>
            hello world
          </Text>

        </ImageBackground>
      </View>
      )
  }
}

export default ViewReply