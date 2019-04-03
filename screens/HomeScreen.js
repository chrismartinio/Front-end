import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import { WebBrowser } from 'expo';
import Firebase from '../storage/Store'

import { MonoText } from '../components/StyledText';
import t from 'tcomb-form-native';
import axios from 'axios'
import { signInWithFacebook } from '../utils/auth.js'

import { Constants } from 'expo';
const { manifest } = Constants;

const Form = t.form.Form;

const User = t.struct({
  username: t.String,
  password: t.String,
});



export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };




  handleEmailAndPasswordSignin = () => {
    const value = this._form.getValue();

    // front end check:
    console.log('value: ', value);
    // axios request here:


    // use action to send data to store.


    // send email and password to redux:


    this.props.navigation.navigate('Chat');
    //if exists

    //then navigate to next screen
  }

  handleSignUp = () => {
    this.props.navigation.navigate('SignUp');
  }

  handleSocialMediaSignIn = (event) => {
    const value = this._form.getValue();
    //66 = fb
    //76= google
    // 86  twitter
    console.log(event.target)
    switch(event.target){
      case 67 :
        this.checkFaceBookValidity(value)
        console.log('checked in with fb')
        break;
      case 77:
        // google auth
        break;
      case 87:
        // twitter auth
        break;
      default:
        console.log('broken');

    }

  }



  checkFaceBookValidity = (signInData) => {
    var fbData = signInWithFacebook()
    fbData.then((data)=>{
      console.log(data.data)
      this.props.navigation.navigate('Chat')
    }).catch((err)=>{
      console.log(err)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/blindly.jpg')
                  : require('../assets/images/blindly.jpg')
              }
              style={styles.welcomeImage}
            />
          </View>
          <View style={styles.formContainer}>
            <Form
              type={User}
              ref={c => this._form = c}
            />
          </View>


      <View style={styles.container}>
        <Button
          title="Sign in!"
          onPress={(e)=>this.handleEmailAndPasswordSignin(e)}
          color='blue'
          key='100'
        />
      </View>

        <Button
          title="Sign Up!"
          onPress={this.handleSignUp}
          color='blue'
        />

        <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
          <Button
            title="facebook"
            onPress={this.handleSocialMediaSignIn}
            color='blue'
          />

        <Button
          title="google"
          onPress={this.handleSocialMediaSignIn}
          color='blue'
        />

        <Button
          title="twitter"
          onPress={this.handleSocialMediaSignIn}
          color='blue'
        />
        </View>

        </ScrollView>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  welcomeImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
