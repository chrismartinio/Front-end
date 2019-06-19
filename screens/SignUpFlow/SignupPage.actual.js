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
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo';
// import Categories from '../../components/SignUpFlow/Categories'
import t from 'tcomb-form-native';
import { connect } from 'react-redux'
import SetProfilePersonalAction from '../../storage/actions/SetProfilePersonalAction'
import firebase from '../../utils/mainFire'





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
      <View  style={{flex:1}}>

        <LinearGradient
          textStyle={{ color: '#fff' }}colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >
        <ImageBackground source={require('../../assets/Assets_V1/Butterfly_Background/butterflyBackground.png')} style={styles.backgroundImage}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >

        <ScrollView >
          <Text style={styles.titleText}>
            Sign Up
          </Text>

          <View style={{justifyContent: "flex-end",margin:10, color: '#fff',width: "80%",left:"10%"}}>
          <TextInput
                style={styles._textInput}
                placeholder="email"
                placeholderTextColor="#fff"
                onChangeText={(email) => this.setState({email})}
                //value={this.state.email}
                
              />
              <TextInput
                style={styles._textInput}
                placeholder="confirm email"
                placeholderTextColor="#fff"
                onChangeText={(emailCheck) => this.setState({emailCheck})}

              />
              <TextInput
                style={styles._textInput}
                placeholder="password"
                placeholderTextColor="#fff"
                onChangeText={(password) => this.setState({password})}

              />
              <TextInput
                style={styles._textInput}
                placeholder="confrim password"
                placeholderTextColor="#fff"
                onChangeText={(passwordCheck) => this.setState({passwordCheck})}

              />
              <Text style={styles.smallText}>
            *all fields required
          </Text>
          
          </View>

        </ScrollView>
        </KeyboardAvoidingView>
        </ImageBackground>


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
  inner: {
      padding: 24,
      flex: 1,
      justifyContent: "flex-end",
  },
  titleText:{
    margin:10, 
    color: '#fff',
    fontSize:48,
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
backgroundImage: {
  height: '100%',
  width: '100%',
  flex: 1,
}
});
const mapStateToProps = (state) => ({
  ...state
})
const mapDispatchToProps = (dispatch) => ({
  SetProfilePersonalAction: (payload) => dispatch(SetProfilePersonalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);

