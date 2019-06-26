import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Picker,
  TextInput,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';
// import Categories from '../../components/SignUpFlow/Categories'
import t from 'tcomb-form-native';
import { connect } from 'react-redux'
import SetProfilePersonalAction from '../../storage/actions/SetProfilePersonalAction'
import firebase from '../../utils/mainFire'
import Slider from './CSlider'
import { Math } from 'core-js';

let pickedMen=false;
let pickedWomen=false;

let bkgMen='transparent';
let bkgWomen='transparent';

class SignupPage extends React.Component {
  static navigationOptions = {
    //header: null,
    //title: 'Match Chat',
    headerStyle: {
      backgroundColor: '#18cdf6',
    },
    footerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize:24
    },
  };

  //having null header means no back  button is present!
  constructor(props) {
    super(props);
    this.state = {
      pickedMen:'transparent',
      pickedWomen:'transparent',
      ageRange:18,
      distanceRange:0 };
  }
  handleBackToSignIn = () => {
    this.props.navigation.navigate('SignIn')
  }
  handleListener = (arg) => {
    //console.log(arg)
  }
  setAgeRange = (arg) => {

    this.setState({
      ageRange:arg
    })
    //console.log(this.state.ageRange)
  }
  setDistanceRange = (arg) => {
    this.setState({
      distanceRange:arg
    })
    //console.log(this.state.distanceRange)
  }
  pickedMen = () => {
    pickedMen=!pickedMen;
    if(pickedMen===true)this.setState({pickedMen:'green'})
    else this.setState({pickedMen:'transparent'})
  }
  pickedWomen = () => {
    pickedWomen=!pickedWomen;
    if(pickedWomen===true)this.setState({pickedWomen:'green'})
    else this.setState({pickedWomen:'transparent'})
  }


  handleSubmit = () => {
    this.props.navigation.navigate('TestWouldRather');

    return;

  }

  render(){
    if(pickedMen==true)bkgMen='green'
    else bkgMen='transparent'
    console.log(this.state)
    return(

      <View  style={styles.container}>

        <LinearGradient
          textStyle={{ color: '#fff' }}colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >


        <ScrollView >
          <Text style={styles.titleText}>
            I'm interested in...
          </Text>
          <View alignItems= 'center'>
          <Text style={styles.text}>
            Pick one or both
          </Text>
          </View>
          <View style={{margin:10, color: '#fff',width: "80%",left:"10%"}}>
          <View alignItems= 'center'>
              <TouchableOpacity style={{alignItems: 'center',
                                        padding: 10,
                                        borderRadius: 40,
                                        borderWidth: 2,
                                        borderColor: '#fff',
                                        width:'55%',
                                        backgroundColor:this.state.pickedMen}} onPress={this.pickedMen}>

              <Text style={styles.button}>Men</Text>

              </TouchableOpacity>
          </View>
          <View alignItems= 'center' top={25}>
          <TouchableOpacity style={{alignItems: 'center',
                                        padding: 10,
                                        borderRadius: 40,
                                        borderWidth: 2,
                                        borderColor: '#fff',
                                        width:'55%',
                                        backgroundColor:this.state.pickedWomen}} onPress={this.pickedWomen}>

              <Text style={styles.button}>Women</Text>

              </TouchableOpacity>
          </View>

          <Text style={styles.titleText2}>
            Set your preferences
          </Text>
          <Text style={styles.textTop}>Preferred age range</Text>

         <View style={styles.slider1}>
           <Slider
             functionListener={this.setAgeRange}
             minimumValue={18}
            maximumValue={110}
             leftBound={'18'}
             rightBound={'110'}
            />
         </View>
         <Text style={styles.textTop2}>Preferred match radius (miles)</Text>

         <View style={styles.slider2}>
           <Slider
             functionListener={this.setDistanceRange}
             minimumValue={0}
            maximumValue={110}
            leftBound={'0'}
             rightBound={'110'}
            />
         </View>





          <View alignItems= 'center' top={100}>
              <TouchableOpacity style={styles.button2}onPress={this.handleSubmit}>

              <Text style={styles.button}>Next</Text>

              </TouchableOpacity>
          </View>
          </View>

        </ScrollView>


        </LinearGradient>
      </View>
      )
  }

}
const {height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleText:{
    margin:10,
    color: '#fff',
    fontSize:48,
    textAlign:"center",
    fontWeight:"100"
  },
  titleText2:{
    margin:10,
    color: '#fff',
    fontSize:48,
    top:25,
    textAlign:"center",
    fontWeight:"100"
  },
  _textInput:{
    color: '#fff',
    fontSize: 20,
    textAlign: 'left',
    paddingTop: '20%',
    borderBottomWidth: 1,
    borderColor: '#fff',
},
smallText:{
  margin:10,
  color: '#fff',
  fontSize:10
},
text:{
  margin:10,
  color: '#fff',
  fontSize:20,
  textAlign:'center'
},
textTop:{
  top:40,
  margin:10,
  color: '#fff',
  fontSize:20,
  textAlign:'center'
},
textTop2:{
  top:60,
  margin:10,
  color: '#fff',
  fontSize:20,
  textAlign:'center'
},button:{
  color: '#fff',
  fontSize:20
},
button2: {
  alignItems: 'center',
  padding: 10,
  borderRadius: 40,
  borderWidth: 2,
  borderColor: '#fff',
  width:'55%'
},
buttonMen: {
  alignItems: 'center',
  // backgroundColor: bkgMen,
  padding: 10,
  borderRadius: 40,
  borderWidth: 2,
  borderColor: '#fff',
  width:'55%'
},buttonWomen: {
  alignItems: 'center',
  backgroundColor: bkgWomen,
  padding: 10,
  borderRadius: 40,
  borderWidth: 2,
  borderColor: '#fff',
  width:'55%'
},
slider1:{
 top: 60
},
slider2:{
  top: 80
},
slider3: {
  top:15
}
});
const mapStateToProps = (state) => ({
  ...state
})
const mapDispatchToProps = (dispatch) => ({
  SetProfilePersonalAction: (payload) => dispatch(SetProfilePersonalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
