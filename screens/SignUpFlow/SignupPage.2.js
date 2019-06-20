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
  Slider
} from 'react-native';
import { LinearGradient } from 'expo';
// import Categories from '../../components/SignUpFlow/Categories'
import t from 'tcomb-form-native';
import { connect } from 'react-redux'
import SetProfilePersonalAction from '../../storage/actions/SetProfilePersonalAction'
import firebase from '../../utils/mainFire'
import CSlider from './CSlider'




class SignupPage extends React.Component {
  // static navigationOptions = {
  //   header: null,
  // };

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
      this.props.navigation.navigate('Registration');
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
          <Slider style={styles.slider}></Slider>
          <Text style={styles.text}>18                                110</Text>

          <Text style={styles.text}>Preferred match radius</Text>
          <CSlider style={styles.slider}></CSlider>
          <Text style={styles.text}>0                                110</Text>

          <View alignItems= 'center' top={25}>
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>
               
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleText:{
    margin:10, 
    color: '#fff',
    fontSize:48,
    textAlign:"center"
  },
  titleText2:{
    margin:10, 
    color: '#fff',
    fontSize:48,
    top:25,
    textAlign:"center"
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
  top:25,
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
slider:{
  top:12
}
});
const mapStateToProps = (state) => ({
  ...state
})
const mapDispatchToProps = (dispatch) => ({
  SetProfilePersonalAction: (payload) => dispatch(SetProfilePersonalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);

