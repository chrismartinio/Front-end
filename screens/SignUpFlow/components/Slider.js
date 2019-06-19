import React from 'react'
import {
    View, Text, Slider , StyleSheet, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';
//import Slider from '@react-native-community/slider';

class CSlider extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      leftBound: 'Daryl in Tank Top',
      rightBound: 'Daryl in Polo'
    }
  }

  handleCallbackListener = (value) => {
    // callback listener must return true

        this.props.functionListener(value)
        console.log(value)
  }



  render(){


    return(

      <View style={{flex:1}}>
        <Slider
          style={styles.slider}
          value={0}
          minimumValue={-1}
          maximumValue={1}
          minimumTrackTintColor={'grey'}
          maximumTrackTintColor={'grey'}
          onSlidingComplete={(value)=>{
            this.handleCallbackListener(value)
          }}
        />

       <View style={styles.flexContainer}>
          <Text style={styles.text}> {this.props.leftBound}  </Text>
          <Text style={styles.text}> {this.props.rightBound}  </Text>
        </View>

      </View>

      )
  }
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  flexContainer: {
    flex:1,
    top: height *.45,
    flexDirection: 'row',
    justifyContent:'space-between',
    position:'absolute',
    alignItems:'stretch',
    width:'100%'
  },
  text:{
    color:'white',
  },
  slider:{
    top:height * .4
  }
})

export default CSlider;