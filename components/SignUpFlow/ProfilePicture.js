import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import { BlurView } from 'expo';


//take a user picture and display it on the field
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
class ProfilePicture extends Component{
  constructor(props){
    super(props)
    this.state = {
      intensity: new Animated.Value(0),
      blurRadius: 90,
      intervalId:null
    }
  }

    handleTimer = () => {
      if(this.state.blurRadius > 0){
        this.setState({
          blurRadius: --this.state.blurRadius
        })
      }

      if(this.state.currentTime === 0){
          clearInterval(this.state.intervalId)
      }
    }

    componentDidMount(){

      this._animate();
      //will need to unmount this eventuall or will cause problems
      const id = setInterval(this.handleTimer, 1000)
      this.setState({
        intervalId:id
      })
    }

   _animate = () => {
      let { intensity } = this.state;
      Animated.timing(intensity, {duration: 1, toValue: 100}).start(() => {
        Animated.timing(intensity, {duration: 9000000, toValue: 0}).start();
      });
   }

  render(){
    return(


        <AnimatedBlurView
          tint="dark"
          intensity={this.state.intensity}
          style={styles.AnimatedStyles}>

          <Animated.Image
              source={{ uri: 'https://images-na.ssl-images-amazon.com/images/I/61McsadO1OL.jpg' }}
              style={styles.imageStyles}
              blurRadius={this.state.blurRadius}
          />

        </AnimatedBlurView>


    )
  }
}
const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
  AnimatedStyles: {
    height:180,
    width:180,
    borderRadius:90,
    zIndex:0 ,
  },
  imageStyles: {
    zIndex:0,
    height: 180,
    width:180,
    borderRadius:90
  }
});

export { ProfilePicture };
