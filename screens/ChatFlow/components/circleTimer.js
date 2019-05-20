import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProfilePicture } from '../../../components/SignUpFlow/ProfilePicture'

 const propStyle = (percent, base_degree) => {
    const rotateBy = base_degree + (percent * 3.6)
    return {
      transform:[{rotateZ:`${rotateBy}deg`}]
    }
  }

  const renderThirdLayer = (percent) => {
    console.log('tthis is the percent:',percent)
    if(percent > 50){

      return <View style={[styles.secondProgressLayer,propStyle((percent - 50), 45) ]}></View>
    } else {
      return <View style={styles.offsetLayer}></View>
    }
  }

const CircleTimer = ({percent}) => {
    let firstProgressLayerStyle;
  if(percent > 50){
      firstProgressLayerStyle = propStyle(50, -135);
  }else {
    firstProgressLayerStyle = propStyle(percent, -135);
  }
  return(
    <View style={styles.container}>
      <View style={[styles.progressLayer, firstProgressLayerStyle]}></View>
      {
        renderThirdLayer(percent)
      }
      <ProfilePicture
          width={170}
          height={170}
          borderRadius={85}
          blurRadius={30}
      />
    </View>
  )

}
//const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
 container: {
  borderColor:'hotpink',
  height: 200,
  width:200,
  borderWidth:10,
  borderRadius:100,
  justifyContent:'center',
  alignItems:'center',
 },
 progressLayer: {
  width:200,
  height:200,
  position:'absolute',
  borderWidth:10,
  borderRadius: 100,
  borderLeftColor: 'transparent',
  borderBottomColor: 'transparent',
  borderRightColor: '#3498db',
  borderTopColor: '#3498db',
  transform:[{rotateZ: '-135deg'}]
 },
  secondProgressLayer:{
    width: 200,
    height: 200,
    position: 'absolute',
    borderWidth: 10,
    borderRadius: 100,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#3498db',
    borderTopColor: '#3498db',
    transform: [{rotateZ: '45deg'}]
  },
 offsetLayer: {
  width:200,
  height:200,
  position:'absolute',
  borderWidth:10,
  borderRadius:100,
  borderLeftColor: 'transparent',
  borderBottomColor: 'transparent',
  borderRightColor: 'hotpink',
  borderTopColor: 'hotpink',
  transform:[{rotateZ: '-135deg'}]
 }
})

export default CircleTimer
