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
      email:'email',
      emailCheck:'email',
      password:'password',
      passwordCheck:'password' };
  }
  handleBackToSignIn = () => {
    this.props.navigation.navigate('SignIn')
  }
  handleListener = (arg) => {
    //console.log(arg)
  }
  SignUpToDatabase = ({ age, email, gender, name, password }) => {
    let userId = email.split('.').join()
    firebase.database().ref('users/' + userId).set({
      age:age,
      email:email,
      gender:gender,
      name:name,
      password:password
    });
  }

  handleSubmit = () => {
    this.props.navigation.navigate('WouldRather');

    return;
    const value = this._form.getValue();

    console.log(value)
    const nullCheck = (value) => {
        if(value !== null){
          return true
        }
      return false
    }

    const emailCheck = (email) =>{

      // email validty check?
      const checkAT = email.indexOf('@')
      const checkCOM = email.indexOf('.com')
        if(checkAT > 0 && checkCOM > 0 && email.length > 4){
          return true
        }
      console.log("Please Properly insert a email with a '@' & a '.com'")
      return false
    }

    const passwordCheck = (password) => {
      if(password.length > 6 ){
        return true
      }

      return false
    }

    if(nullCheck(value) && emailCheck(value.email) && passwordCheck(value.password)){
      for(let key in value){
        value[key] = JSON.stringify(value[key])
      }
      this.SignUpToDatabase(value)
      this.props.SetProfilePersonalAction(value)

    }
  }

  render(){
    //console.log(this.state.text)
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
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>

              <Text style={styles.button}>Men</Text>

              </TouchableOpacity>
          </View>
          <View alignItems= 'center' top={25}>
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>

              <Text style={styles.button}>Women</Text>

              </TouchableOpacity>
          </View>

          <Text style={styles.titleText2}>
            Set your preferences
          </Text>
          <Text style={styles.textTop}>Preferred age range</Text>

         <View style={styles.slider1}>
           <Slider
             functionListener={this.handleListener}
             leftBound={'18'}
             rightBound={'110'}
            />
         </View>
         <Text style={styles.textTop2}>Preferred match radius (miles)</Text>

         <View style={styles.slider2}>
           <Slider
             functionListener={this.handleListener}
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
  //backgroundColor: '#fff',
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
