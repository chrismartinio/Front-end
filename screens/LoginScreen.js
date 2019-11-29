import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from "react-native";
import Firebase from "../storage/Store";
import { MonoText } from "../components/StyledText";
import t from "tcomb-form-native";
import { signInWithFacebook } from "../utils/auth.js";
import { connect } from "react-redux";
import SetFbDataAction from "../storage/actions/DataReducerActions/SetFbDataAction";
import SetJwtAction from "../storage/actions/DataReducerActions/SetJwtAction";
import SetGUIDAction from "..//storage/actions/RegistrationActions/SetGUIDAction";
import SetAboutYouDataAction from "../storage/actions/RegistrationActions/SetAboutYouDataAction";
//import publicIP from "react-native-public-ip";
import * as WebBrowser from "expo-web-browser";
import * as Location from "expo-location";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

const { manifest } = Constants;

const Form = t.form.Form;

const User = t.struct({
  username: t.String,
  password: t.String
});

import { localhost } from "../config/ipconfig";
import {
  createTablesInToLocalStorage,
  displayAllTablesFromLocalStorage,
  dropAllTablesInLocalStorage,
  deleteDeviceUserData
} from "./ProfileFlow/LocalStorage/localStorage.js";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    location: null,
    errorMessage: null
  };

  //Profile Services uses
  async componentDidMount() {
    console.log("Inside HomeScreen.js creating table");
    //console.log(Platform.OS === "android");
    //console.log(Platform.OS === "ios");
    //create tables for device's user

    ///////////////////////////////
    //LOCALSTORAGE SECTION (SQLITE)
    ///////////////////////////////

    //DROP ALL TABLES
    //NOTICE: If you want to add a new column, you would have following:
    //1. uncomment dropAllTablesInLocalStorage();
    //2. run the app again
    //3. comment dropAllTablesInLocalStorage();
    //REASON: createTablesInToLocalStorage() will only create tables if there is no tables
    //That begin said, if there is a table exist,
    //createTablesInToLocalStorage() won't create new table or update the table
    //so you would have to delete the old table (old columns)
    //then re-create a new table (new columns

    //dropAllTablesInLocalStorage();

    //CREATE TABLES
    createTablesInToLocalStorage();

    //DISPLAY Tables
    //displayAllTablesFromLocalStorage();

    //DELETE Device's user data
    //deleteDeviceUserData()

    //create tables for matched's user
  }

  handleEmailAndPasswordSignin = async () => {
    // needs to have json web token?
    try {
      const { username, password } = this._form.getValue();

      let data = await fetch(`http://${localhost}:3002/api/auth/login`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: password,
          username: username,
          mode: 2,
          authType: "email"
        })
      });

      let jsonData = await data.json();
      if (jsonData.token) {
        let { guid, firstName } = jsonData.data;
        this.props.SetJwtAction(jsonData.token);

        this.props.SetGUIDAction({
          guid: guid
        });

        this.props.SetAboutYouDataAction({
          firstName: firstName,
          lastName: "",
          birthDate: "",
          gender: "",
          country: "",
          zipCode: ""
        });
        this.props.navigation.navigate("Main");
      } else {
        alert(jsonData.error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleSignUp = () => {
    this.props.navigation.navigate("SignUp");
  };

  DBCheck = async info => {
    try {
      console.log(info.uid);
      let data = await fetch(`http://${localhost}:3070/api/auth/login`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: info.uid,
          username: info.email
        })
      });

      let jsonData = await data.json();
      return jsonData;
    } catch (e) {
      console.log(e.error);
    }
  };

  checkFaceBookValidity = async signInData => {
    try {
      //const { username, password } = this._form.getValue();
      var fbData = signInWithFacebook();
      fbData
        .then(data => {
          return data;
        })
        .then(fbData => {
          fetch(`http://${localhost}:3070/api/auth/login`, {
            method: "POST",
            mode: "cors",
            credentials: "same-origin",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              mode: 2,
              authType: "facebook",
              data: fbData
            })
          })
            .then(AuthData => {
              return AuthData.json();
            })
            .then(data => {
              this.props.SetJwtAction(data.token);
              this.props.navigation.navigate("Chat");
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require("../assets/images/blindly.jpg")
                  : require("../assets/images/blindly.jpg")
              }
              style={styles.welcomeImage}
            />
          </View>
          <View style={styles.formContainer}>
            <Form type={User} ref={c => (this._form = c)} />
          </View>

          <View style={styles.container}>
            <Button
              title="Sign in!"
              onPress={e => this.handleEmailAndPasswordSignin(e)}
              color="blue"
              key="100"
            />
            <Text />
          </View>

          <Button title="Sign Up!" onPress={this.handleSignUp} color="blue" />

          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          >
            <Button
              title="facebook"
              onPress={this.checkFaceBookValidity}
              color="blue"
            />

            <Button
              title="google"
              onPress={this.checkFaceBookValidity}
              color="blue"
            />

            <Button
              title="twitter"
              onPress={this.checkFaceBookValidity}
              color="blue"
            />
          </View>

          {/*Testing USE*/}
          <Button
            title="Testing - Go to Link Screen"
            onPress={() => this.props.navigation.navigate("Links")}
          />
          <Button
            title="Testing - Go to Main Screen"
            onPress={() => this.props.navigation.navigate("Main")}
          />
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
          Development mode is enabled, your app will be slower but you can use
          useful development tools. {learnMoreButton}
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
    WebBrowser.openBrowserAsync(
      "https://docs.expo.io/versions/latest/guides/development-mode"
    );
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      "https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes"
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  formContainer: {
    justifyContent: "center",
    marginTop: 50,
    padding: 10,
    backgroundColor: "#ffffff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10
  },
  welcomeImage: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  SetAboutYouDataAction: payload => dispatch(SetAboutYouDataAction(payload)),
  SetGUIDAction: payload => dispatch(SetGUIDAction(payload)),
  SetFbDataAction: payload => dispatch(SetFbDataAction(payload)),
  SetJwtAction: payload => dispatch(SetJwtAction(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
