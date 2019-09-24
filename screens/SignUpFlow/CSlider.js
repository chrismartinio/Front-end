import React from 'react'
import {
   View, Text, Slider , StyleSheet, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
//import Slider from '@react-native-community/slider';
let val =0;
class CSlider extends React.Component {

 constructor(props){
   super(props)
   this.state = {
     leftBound: 'Daryl in Tank Top',
     rightBound: 'Daryl in Polo',
     minimumValue:-50,
      maximumValue:50,
     value: 0
   }
 }

 handleCallbackListener = (value) => {
   // callback listener must return true

       this.props.functionListener(value)
       //console.log(value)
       val=value;
       this.setState({
         value:value
       })

 }
 handleRealTimeUpdate = (value) => {
  // callback listener must return true

      this.props.functionListener(value)
      //console.log(value)
      val=value;
      this.setState({
        value:value
      })

}


 render(){


   return(

     <View style={{flex:1}}>
     {/* <View style={styles.flexContainer}>
         <Text style={styles.text}> {-1*(Math.floor(this.state.value)-50)}  </Text>
         <Text style={styles.text}> {Math.floor(this.state.value)+50}  </Text>
       </View> */}
       <Slider
         style={styles.slider}
         value={0}
         minimumValue={this.props.minimumValue}
         maximumValue={this.props.maximumValue}
         minimumTrackTintColor={'#fff'}
         maximumTrackTintColor={'#fff'}
         step={1}
         onSlidingComplete={(value)=>{
           this.handleCallbackListener(value)
         }}
         onValueChange={(value)=>{
          //this.handleRealTimeUpdate(value)
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
   //top: height *.45,
   flexDirection: 'row',
   justifyContent:'space-between',
   //position:'absolute',
   alignItems:'stretch',
   width:'100%'
 },
 text:{
   color:'white',
 },
 slider:{
   //top:height * .4
 }
})

export default CSlider;
