import React, { Component } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from 'expo';
import { connect } from 'react-redux'
import SetProfilePersonalAction from '../../storage/actions/SetProfilePersonalAction'
import firebase from '../../utils/mainFire'

class Welcome extends Component {
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
  static navigationOptions = {
    header: null,
    
  };
  SignUpToDatabase = ({ age, email, gender, name, password }) => {
    let userId = email.split('.').join()
    firebase.database().ref('users/' + userId).set({
      age:age,
      email:email,
      gender:gender,
      name:name,
      password:password
    });
  };
  handleSubmit = () => {

    const value = this.state.email;
    const password = this.state.password;
    //console.log(nullCheck)//this.nullCheck(value);
    //console.log(value)
    const nullCheck = (value) => {
        if(value !== 'email'&&value!==""){

          return true
        }
      return false
    }
    //console.log(nullCheck(value))
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

    if(nullCheck(value) && emailCheck(value) && passwordCheck(password)){
      console.log("yay")
      // for(let key in value){
      //   value[key] = JSON.stringify(value[key])
      // }
      // this.SignUpToDatabase(value)
      // this.props.SetProfilePersonalAction(value)
      this.props.navigation.navigate('TestAboutUs');
    }
  }
    render() {
        return (

            <View>

                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inner}>

                        <Text style={styles.titleText}>
                          Sign Up
                        </Text>
                <TextInput
                style={styles._textInput}
                placeholder="email"
                placeholderTextColor="#fff"
                onChangeText={(email) => this.setState({email})}
                autoCompleteType={false}
                autoCapitalize="none"
                autoCorrect={false}
                //value={this.state.email}

              />
              <TextInput
                style={styles._textInput}
                placeholder="confirm email"
                placeholderTextColor="#fff"
                onChangeText={(emailCheck) => this.setState({emailCheck})}
                autoCompleteType={false}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                style={styles._textInput}
                placeholder="password"
                placeholderTextColor="#fff"
                onChangeText={(password) => this.setState({password})}
                autoCompleteType={false}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
              />
              <TextInput
                style={styles._textInput2}
                placeholder="confrim password"
                placeholderTextColor="#fff"
                onChangeText={(passwordCheck) => this.setState({passwordCheck})}
                autoCompleteType={false}
                autoCapitalize="none"
                secureTextEntry={true}
                autoCorrect={false}
              />
          <Text style={styles.smallText}>
            *all fields required
          </Text>
          <Text></Text>
          {/* <View alignItems= 'center' >
                    <TouchableOpacity style={styles.button2}onPress={this.handleSubmit}>
                      <Text style={styles.button}>Next</Text>
                    </TouchableOpacity>
                  </View> */}
                            <View style={{ flex : 1 }} />
                        </View>
                    </TouchableWithoutFeedback>

                </SafeAreaView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "flex-end",
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
    },
    input: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36,
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12,
    },
    button:{
      color: '#fff',
      fontSize:20
    },
    _textInput:{
      color: '#fff',
      fontSize: 20,
      textAlign: 'left',
      paddingTop: '20%',
      borderBottomWidth: 1,
      borderColor: '#fff',
  },
   _textInput2:{
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
    fontSize:10,

  },
  titleText:{
    margin:10,
    color: '#fff',
    fontSize:48,
    textAlign:"center",
    fontWeight:"100"
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
  backgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
  }
});

export default Welcome;
