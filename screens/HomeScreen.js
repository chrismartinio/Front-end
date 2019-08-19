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
import Firebase from '../storage/Store'
import { MonoText } from '../components/StyledText';
import t from 'tcomb-form-native';
import axios from 'axios'
import { signInWithFacebook } from '../utils/auth.js'
import { connect } from 'react-redux'
import SetFbDataAction from '../storage/actions/ThirdPartyActions/SetFbDataAction'
import { Constants, Location, Permissions,  WebBrowser } from 'expo';
const { manifest } = Constants;

const Form = t.form.Form;

const User = t.struct({
  username: t.String,
  password: t.String,
});


class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    location: null,
    errorMessage: null,
  };


// Aysnc problems
  // componentWillMount() {
  //   if (Platform.OS === 'android' && !Constants.isDevice) {
  //     this.setState({
  //       errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
  //     });
  //   } else {
  //     this._getLocationAsync();
  //   }
  // }

  // _getLocationAsync = async () => {
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   if (status !== 'granted') {
  //     this.setState({
  //       errorMessage: 'Permission to access location was denied',
  //     });
  //   }

  //   let location = await Location.getCurrentPositionAsync({});
  //   console.log(location)
  //   this.setState({ location });
  // };

  handleEmailAndPasswordSignin = async() => {

      const { username, password } = this._form.getValue();
          let data = await fetch('http://10.0.0.246:3001/api/auth/login', {
            method: 'POST',
            mode:'cors',
            credentials: "same-origin",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            password: password,
            username: username,
            mode: ''
          })})

        let jsonData = await data.json()
        console.log(jsonData)
        // must compare passwords!
        if(jsonData.token){
          this.props.navigation.navigate('Chat');
        } else {

        }

  }


    handleTestAddUser = async() => {
    try{
    const { username, password } = this._form.getValue();
    // front end check:
        let data = await fetch('http://10.0.0.246:3001/api/auth/login', {
          method: 'POST',
          mode:'cors',
          credentials: "same-origin",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          password: password,
          username: username
        })})

      let jsonData = await data.json()
      console.log(jsonData)
      this.props.navigation.navigate('Chat');
    } catch(e){
      console.log(e.error)
    }
  }

  handleSignUp = () => {
    this.props.navigation.navigate('SignUp');
  }

  handleSocialMediaSignIn = (event) => {
    const value = this._form.getValue();

  }



  checkFaceBookValidity = (signInData) => {
    var fbData = signInWithFacebook()
    fbData.then((data)=>{
      console.log(data)
      let profData = {
        firstName: data.data.additionalUserInfo.profile.first_name,
        lastName: data.data.additionalUserInfo.profile.last_name,
        email:data.data.additionalUserInfo.profile.email,
        uid: data.data.user.uid,
        mode:'undone'
      }

      this.props.SetFbDataAction(profData)

      //check here if user email/or uuid exists in db
        // if it does; continue to chat
        // if it doesn't continue to onboarding.
          // the prof data above changes the undone button from 3 to 4 depending
          // if the prof data is found or not

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
        <Text>
        </Text>
      </View>

        <Button
          title="Sign Up!"
          onPress={this.handleSignUp}
          color='blue'
        />

        <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
          <Button
            title="facebook"
            onPress={this.checkFaceBookValidity}
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
const mapStateToProps = (state) => ({
  ...state
})

const mapDispatchToProps = (dispatch) => ({
  SetFbDataAction: (payload) => dispatch(SetFbDataAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
