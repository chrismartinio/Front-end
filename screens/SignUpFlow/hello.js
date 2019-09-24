import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Button,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'

var pic1='https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg';

class Hello extends React.Component {

  render() {
    return <View>
            <Image
              style={{top:-10,width:60,height:60,borderRadius:30,borderWidth:2,borderColor:"white"}}
              blurRadius={9}
              source={{uri: this.props.image}}
              zIndex={-5}
            />
            <Text style={{top:-30,left:60,color:"white"}}>{this.props.user}</Text>

            {/* <TouchableHighlight style={{top:-45,left:40,backgroundColor:'white',alignSelf:"center",width:50,height:50, borderRadius:25,borderColor:"white",borderWidth:1}}>
              <Text style={{top:15,left:0,color:"#18cdf6",textAlign:"center"}}>{this.props.user}</Text>
            </TouchableHighlight> */}
            </View>


    ;
  }
}
export default Hello;