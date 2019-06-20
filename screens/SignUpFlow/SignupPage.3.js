import React from 'react';
import {
   View, Text, StyleSheet, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';
import Slider from './CSlider'

class WouldRather extends React.Component {



 handleListener = (arg) => {
   console.log(arg)
 }

 render(){
   return(

       <LinearGradient
         textStyle={{ color: '#fff' }} colors={['#18cdf6', '#43218c']}
         style={{flex:1}}
       >
       <View style={{flex:1}}>

         <View style={styles.slider1}>
           <Slider
             functionListener={this.handleListener}
             leftBound={'Books'}
             rightBound={'Movie'}
            />
         </View>

         <View style={styles.slider2}>
           <Slider
             functionListener={this.handleListener}
             leftBound={'Beach'}
             rightBound={'Mountains'}
            />
         </View>

         <View style={styles.slider3}>
           <Slider
             functionListener={this.handleListener}
             leftBound={'Daryl'}
             rightBound={'Daryl'}
            />
         </View>
       </View>

       </LinearGradient>
     )
 }
}

const {height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
 slider1:{
   top: height * .1
 },
 slider2:{
   top: height * .3
 },
 slider3: {
   top:height * .2
 }
})


export default WouldRather;