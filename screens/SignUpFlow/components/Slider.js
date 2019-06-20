// import React from 'react'
// import {
//     View, Text, Slider , StyleSheet, Dimensions
// } from 'react-native';
// import { LinearGradient } from 'expo';
// //import Slider from '@react-native-community/slider';

// class CSlider extends React.Component {

//   constructor(props){
//     super(props)
//     this.state = {
//       leftBound: 'Daryl in Tank Top',
//       rightBound: 'Daryl in Polo',
//       leftPercentage:50,
//       rightPercentage:50,
//       currValue: 50,
//       showPercentages:true,
//     }
//   }

//   handleCallbackListener = (value) => {
//     // callback listener must return true
//         //this.props.functionListener(value)

//   }

  // handlePercentages = (value) => {
  //     this.setState({
  //       currValue:value,
  //       leftPercentage: -1 * (-50 + Math.floor(value)),
  //       rightPercentage: Math.floor(value) + 50
  //     })

  // }



//   render(){
//     return(

//       <View style={styles.flexMomma}>

//         <View style={styles.textFlexContainer}>
//           <Text style={styles.text}>
//             { this.state.leftPercentage }%
//           </Text>
//           <Text style={styles.text}>
//             { this.state.rightPercentage }%
//           </Text>
//         </View>


//         <View style={styles.sliderView}>
//           <Slider
//             style={styles.slider}
//             //style={{width: 200, height: 40}}
//             value={0}
//             minimumValue={-50}
//             maximumValue={50}
//             minimumTrackTintColor={'white'}
//             maximumTrackTintColor={'white'}
//             onSlidingComplete={(value)=>{
//               this.handleCallbackListener(value)
//             }}
//             onValueChange={(value)=>{
//               this.handlePercentages(value)
//             }}
//             onLayout={(value)=>{
//               console.log(value)
//             }}
//           />
//         </View>

//        <View style={styles.flexContainer}>
//           <Text style={styles.text}> {this.props.leftBound} </Text>
//           <Text style={styles.text}> {this.props.rightBound} </Text>
//         </View>
//       </View>

//       )
//   }
// }
// //change height to fit??
// const { width, height } = Dimensions.get('window')
// const styles = StyleSheet.create({
//   flexContainer: {
//     //flex:1,

//     flexDirection: 'row',
//     justifyContent:'space-between',

//   },
//   text:{
//     color:'white',
//   },
//   slider:{
//     height: height * (1/4),
//     //width: width * (3/4),

//   },
//   sliderView:{
//     alignItems:'center'
//   },
//   textFlexContainer: {
//     //flex:1,
//     flexDirection: 'row',
//     justifyContent:'space-between',
//     alignItems:'center'
//   },
//   flexMomma:{
//     //flex:1,
//     borderRadius:1,
//     borderWidth: 1,
//     borderColor: 'blue',
//     padding:0,
//     //height:height * (1/6)
//   }
// })

// export default CSlider;




import React from 'react'
import {
   View, Text, Slider , StyleSheet, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';
//import Slider from '@react-native-community/slider';
let val =0;
class CSlider extends React.Component {

 constructor(props){
   super(props)
   this.state = {
     leftBound: 'Daryl in Tank Top',
     rightBound: 'Daryl in Polo',
     value: 0,
     leftPercentage:50,
     rightPercentage:50
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

      // this.setState({
      //   value:value
      // })

      this.setState({
        currValue:value,
        leftPercentage: -1 * (-50 + Math.floor(value)),
        rightPercentage: Math.floor(value) + 50
      })

}




 render(){


   return(

     <View style={{flex:1}}>
        <View style={styles.textFlexContainer}>
          <Text style={styles.text}>
            { this.state.leftPercentage }%
          </Text>
          <Text style={styles.text}>
            { this.state.rightPercentage }%
          </Text>
        </View>

       <Slider
         style={styles.slider}
         value={0}
         minimumValue={-50}
         maximumValue={50}
         minimumTrackTintColor={'white'}
         maximumTrackTintColor={'white'}
         onSlidingComplete={(value)=>{
           //this.handleCallbackListener(value)
         }}
         onValueChange={(value)=>{
          this.handleRealTimeUpdate(value)
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
 },
   textFlexContainer: {
    //flex:1,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center'
  }
})

export default CSlider;