import React from 'react';
import {
    View, Text, StyleSheet, Dimensions, Button, ScrollView, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo';
import Slider from './components/Slider'

class WouldRather extends React.Component {
  static navigationOptions = {
    header: null,
  }

  handlePress = () => {
    this.props.navigation.navigate('SpendWeekend');
  }

  handleListener = (arg) => {
    console.log(arg)
  }

  render(){
    return(
      <View style={styles.parent}>

        <LinearGradient
          textStyle={{ color: '#fff' }} colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >

         <ScrollView>

         <View style={styles.viewStyle}>
            <Text style={styles.textView}>
              I WOULD RATHER...
            </Text>
            <Text style={styles.titleText2}>
              BE HONEST
            </Text>
          </View>


            <View style={styles.sliderContainer}>
              <View style={styles.V1}>
                <Slider
                  functionListener={this.handleListener}
                  leftBound={'Books'}
                  rightBound={'Movie'}
                 />
              </View>

              <View style={styles.V2}>
                <Slider
                  functionListener={this.handleListener}
                  leftBound={'Wine'}
                  rightBound={'Beer'}
                 />
              </View>

              <View style={styles.V3}>
                <Slider
                  functionListener={this.handleListener}
                  leftBound={'Beach'}
                  rightBound={'Mountains'}
                 />
              </View>
            </View>


            <View style={styles.buttonStyle}>
              <TouchableOpacity style={styles.button2} onPress={this.handlePress}>

                <Text style={{color:'white'}}>Next</Text>

              </TouchableOpacity>
            </View>

          </ScrollView>
        </LinearGradient>
        </View>
      )
  }
}

const {height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
  slider1:{
    alignItems: 'center',
    zIndex:0,
    height:500
  },
  V1:{
    top:height *(.3),
    left:width*(.1),
    width:'80%'

  },
  V2:{
    top:height *(.35),
    left:width*(.1),
    width:'80%'
  },
  V3:{
    top: height *(.4),
    left:width*(.1),
    width:'80%'
  },
  flexSliderContainer:{
    flex:1
  },
  flexContainer: {
    flex:1,
    borderColor:'green',
    justifyContent:'center',
    height:height * (1/3),
    width:width* (4/5),
    borderWidth:1
  },
  text:{
    color:'white',
    alignItems: 'center',
  },
  header:{
    top:height *(1/3),
    left: width * (1/2)
  },
  parent:{
    flex:1,

  },
  button2: {
  alignItems: 'center',
  //backgroundColor: '#fff',
  padding: 10,
  borderRadius: 40,
  borderWidth: 2,
  borderColor: '#fff',
  width:'55%',
  zIndex:1
},
  buttonStyle:{
    padding:10,
    alignItems:'center',
    top:height*(.45)
  },
  textView:{
    margin:10,
    color: '#fff',
    fontSize:48,
    textAlign:"center",
    fontWeight:"100"
  },
    titleText2:{
    color: '#fff',
    fontSize:24,
    textAlign:"center",
    fontWeight:"100"
  },
  viewStyle:{
    top:height * (.20)
  },

})


export default WouldRather;