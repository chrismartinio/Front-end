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
      passwordCheck:'password',
      places:['loading','loading','loading','loading','loading','loading','loading']
    };
  }
  handleBackToSignIn = () => {
    this.props.navigation.navigate('SignIn')
  }
  handleListener = (arg) => {
    //console.log(arg)
  }


    componentDidMount(){
      this.getData()
    }

   getData = async () => {
    try{
      let data = await fetch('http://10.0.0.246:3000/api/onboarding/spendAWeekend', {
        method: 'POST',
        mode:'cors',
        credentials: "same-origin",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        password: 'password',
        username: 'name'
      })})

      let jsonData = await data.json()
      this.setState({
        places: jsonData
      })
    } catch(e){
      console.log('failed toload data',e)
    }
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
            Spend a weekend
          </Text>
          <View alignItems= 'center'>
          <Text style={styles.text}>
            based on your location...
          </Text>
          </View>
          <View style={{margin:10, color: '#fff',width: "80%",left:"10%"}}>
          <View alignItems= 'center' >
              <TouchableOpacity style={styles.button1}onPress={this.handlPress}>

              <Text style={styles.button}>San Francisco</Text>

              </TouchableOpacity>
              <Text></Text>
          </View>
          <View style={{ flexDirection: 'row',alignItems:'center',alignContent:'center' }}>
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>

              <Text style={styles.button}>Tahoe</Text>

              </TouchableOpacity>
              <Text> </Text>
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>

              <Text style={styles.button}>Monterey</Text>

              </TouchableOpacity>

          </View>
          <Text></Text>
          <View style={{ flexDirection: 'row',alignItems:'center',alignContent:'center' }}>
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>

              <Text style={styles.button}>Big Sur</Text>

              </TouchableOpacity>
              <Text> </Text>
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>

              <Text style={styles.button}>Napa</Text>

              </TouchableOpacity>
          </View>
          <Text></Text>
          <View style={{ flexDirection: 'row',alignItems:'center',alignContent:'center' }}>
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>

              <Text style={styles.button}>Santa Cruz</Text>

              </TouchableOpacity>
              <Text> </Text>
              <TouchableOpacity style={styles.button2}onPress={this.handlPress}>

              <Text style={styles.button}>Yosemite</Text>

              </TouchableOpacity>
          </View>
          <Text></Text>
          <View alignItems= 'center' >
              <TouchableOpacity style={styles.button1}onPress={this.handlPress}>

              <Text style={styles.button}>Morro Bay</Text>

              </TouchableOpacity>
          </View>
          <View alignItems= 'center' top={75}>
              <TouchableOpacity style={styles.button1}onPress={this.handlPress}>

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
button1: {
  alignItems: 'center',
  padding: 10,
  borderRadius: 40,
  borderWidth: 2,
  borderColor: '#fff',
  width:'65%'
},
button2: {
  alignItems: 'center',
  padding: 10,
  borderRadius: 40,
  borderWidth: 2,
  borderColor: '#fff',
  width:'45%'
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

