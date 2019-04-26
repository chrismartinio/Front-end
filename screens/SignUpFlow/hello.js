import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Button,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';

var pic1='https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg';

class Hello extends React.Component {
  
  render() {
    return <Text>{this.props.user} 
    
    </Text>;
  }
}
export default Hello;