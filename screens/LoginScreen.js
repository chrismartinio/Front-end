import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Safeareaview,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";

import t from "tcomb-form-native";

const { height, width } = Dimensions.get("window");

//Redux
import { connect } from "react-redux";
import SetFbDataAction from "../storage/actions/DataReducerActions/SetFbDataAction";
import SetJwtAction from "../storage/actions/DataReducerActions/SetJwtAction";
import SetGUIDAction from "../storage/actions/RegistrationActions/SetGUIDAction";
import SetAboutYouDataAction from "../storage/actions/RegistrationActions/SetAboutYouDataAction";
import SetIsContinueUserAction from "../storage/actions/RegistrationActions/SetIsContinueUserAction";
import SetChecklistAction from "../storage/actions/RegistrationActions/SetChecklistAction";
import ResetReduxDataAction from "../storage/actions/RegistrationActions/ResetReduxDataAction";
import SetIsThirdPartyServicesUserAction from "../storage/actions/RegistrationActions/SetIsThirdPartyServicesUserAction";

//import publicIP from "react-native-public-ip";
import * as WebBrowser from "expo-web-browser";
import { Linking } from "expo";
import * as Location from "expo-location";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

const { manifest } = Constants;
var _ = require("lodash");
var jwtDecode = require("jwt-decode");
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.error.borderWidth = 0;
stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;

stylesheet.textboxView.normal.borderWidth = 0;
stylesheet.textboxView.error.borderWidth = 0;
stylesheet.textboxView.normal.borderRadius = 0;
stylesheet.textboxView.error.borderRadius = 0;
stylesheet.textboxView.normal.borderBottomWidth = 1;
stylesheet.textboxView.error.borderBottomWidth = 1;
stylesheet.textboxView.normal.marginBottom = 5;
stylesheet.textboxView.error.marginBottom = 5;
stylesheet.textbox.normal.color = "#6a0dad";

const Form = t.form.Form;
var options = {
  stylesheet: stylesheet,
  auto: "placeholders",
  fields: {
    password: {
      password: true,
      secureTextEntry: true
    }
  }
};
const User = t.struct({
  email: t.String,
  password: t.String
});

import { server_auth } from "../config/ipconfig";
import {
  createTablesInToLocalStorage,
  displayAllTablesFromLocalStorage,
  dropAllTablesInLocalStorage,
  deleteDeviceUserData,
  createMatchedUserTablesInToLocalStorage
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
    errorMessage: null,
    redirectionData: null
  };

  //Profile Services uses
  async componentDidMount() {
    //Reset Redux at the beginning
    this.props.SetJwtAction(null);
    this.props.ResetReduxDataAction({
      reset: true
    });

    ///////////////////////////////
    //LOCALSTORAGE SECTION (SQLITE)
    ///////////////////////////////
    console.log("LOGINSCREEN - CREATING TABLES");

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

    //CREATE DEVICE'S USER TABLES
    createTablesInToLocalStorage();

    //CREATE MATCHED'S USER TABLES
    createMatchedUserTablesInToLocalStorage();

    //DISPLAY Tables
    //displayAllTablesFromLocalStorage();

    //DELETE Device's user data
    //deleteDeviceUserData()

    //create tables for matched's user
  }

  localLogin = async () => {
    let email = "",
      password = "";
    try {
      email = this._form.getValue().email;
      password = this._form.getValue().password;
    } catch (e) {
      return alert("Please fill in Email or Password");
    }

    await fetch(`${server_auth}/api/auth/login`, {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: password,
        email: email
      })
    })
      .then(res => {
        if (res.status === 401) {
          let err = new Error("Invalid Email and Password");
          err.httpStatusCode = 401;
          throw err;
        }
        return res;
      })
      .then(res => res.json())
      .then(async res => {
        if (!res.jwt) throw new Error("Jwt is missing");
        var decoded = jwtDecode(res.jwt);

        let { guid, firstName, checklist } = decoded;

        //store jwt to redux
        this.props.SetJwtAction(res.jwt);

        //store firstName to redux
        this.props.SetAboutYouDataAction({
          firstName: firstName,
          lastName: "",
          birthDate: "",
          gender: "",
          country: "",
          zipCode: ""
        });

        let isContinueUser = false;
        let isContinueUserForImage = false;
        //Any false inside the object values
        //means the user has not finished one of the screen
        //and mark them as continue user
        Object.entries(checklist).forEach(e => {
          let key = e[0],
            value = e[1];
          if (key !== "imageProcessing") {
            //Registration Screen
            if (!value) {
              isContinueUser = true;
            }
          } else {
            //Selfie Screen
            if (!value) {
              isContinueUserForImage = true;
            }
          }
        });

        //store guid to redux
        this.props.SetGUIDAction({
          guid: guid
        });

        //if the user is a continue user, send the user back to registration
        if (isContinueUser) {
          return this.props.navigation.navigate("Registration");
        }

        //if the user is a continue user and have not finish the image,
        //send them to registration selfie screen
        if (isContinueUserForImage) {
          return this.props.navigation.navigate("Selfie", { isEdit: false });
        }

        this.props.navigation.navigate("PreSettings");
      })
      .catch(err => {
        if (err.httpStatusCode === 401) {
          alert("Incorrect Email or Password");
        } else {
          alert("Request Failed.\nPlease Try Again.");
        }
      });
  };

  handleSignUp = () => {
    this.props.SetJwtAction(null);
    this.props.ResetReduxDataAction({
      reset: true
    });
    this.props.navigation.navigate("Registration");
  };

  openBrowser = async provider => {
    try {
      let result = await WebBrowser.openAuthSessionAsync(
        `${server_auth}/api/auth/${provider}?deepLink=${Linking.makeUrl("/?")}`
      );

      //console.log(`Result from ${provider}`, result);

      if ((result.type = "success")) {
        let redirectionData = result.url ? Linking.parse(result.url) : null;

        //console.log(redirectionData);

        if (!redirectionData || !redirectionData.queryParams.jwt)
          throw new Error("Url is invalid, might not contain jwt");

        const decodedToken = jwtDecode(redirectionData.queryParams.jwt);
        //console.log("User token", decodedToken);

        let { guid, firstName, checklist, isThirdParty } = decodedToken;

        //Set is Third Party Services Provider User
        this.props.SetIsThirdPartyServicesUserAction({
          isThirdPartiesServiceUser: isThirdParty
        });

        //store jwt to redux
        this.props.SetJwtAction(redirectionData.queryParams.jwt);

        //store firstName to redux
        this.props.SetAboutYouDataAction({
          firstName: firstName,
          lastName: "",
          birthDate: "",
          gender: "",
          country: "",
          zipCode: ""
        });

        //store guid to redux
        this.props.SetGUIDAction({
          guid: guid
        });

        let isContinueUser = false;
        let isContinueUserForImage = false;
        //Any false inside the object values
        //means the user has not finished one of the screen
        //and mark them as continue user
        //console.log(checklist);
        Object.entries(checklist).forEach(e => {
          let key = e[0],
            value = e[1];
          if (key !== "imageProcessing") {
            //Registration Screen
            if (!value) {
              isContinueUser = true;
            }
          } else {
            //Selfie Screen
            if (!value) {
              isContinueUserForImage = true;
            }
          }
        });

        //if the user is a continue user, send the user back to registration
        if (isContinueUser) {
          return this.props.navigation.navigate("Registration");
        }

        //if the user is a continue user and have not finish the image,
        //send them to registration selfie screen
        if (isContinueUserForImage) {
          return this.props.navigation.navigate("Selfie", { isEdit: false });
        }

        this.setState({ redirectionData });

        this.props.navigation.navigate("PreSettings");
      } else throw new Error("Redirection failed");
    } catch (e) {
      alert(`${provider} login failed`);
      console.log(`${provider} login failed`, e);
    }
  };

  checkFaceBookValidity = async () => {
    this.openBrowser("facebook");
  };

  checkGoogleValidity = () => {
    this.openBrowser("google");
  };

  checkTwitterValidity = () => {
    this.openBrowser("twitter");
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="position"
          keyboardVerticalOffset={-300}
          enabled
        >
          {/*space*/}
          <View
            style={{
              padding: width >= 375 ? `${width * 0.036}%` : `${width * 0.013}%`
            }}
          />

          {/*Image*/}
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require("../assets/images/butterfly.png")
                  : require("../assets/images/butterfly.png")
              }
              style={styles.welcomeImage}
            />
          </View>

          {/*space*/}
          <View style={{ padding: width >= 375 && `${width * 0.013}%` }} />

          {/*email and password input*/}
          <View style={styles.formContainer}>
            <Form
              options={options}
              autoCapitalize="none"
              type={User}
              ref={c => (this._form = c)}
            />
          </View>

          {/*Sign in Button*/}
          <View style={styles.buttonStyle}>
            <Button
              title="Sign In"
              onPress={e => this.localLogin(e)}
              color="white"
              key="100"
            />
          </View>

          {/*Sign Up Button*/}
          <View style={styles.buttonStyleOutline}>
            <Button
              title="Sign Up"
              onPress={this.handleSignUp}
              color="#6a0dad"
              key="100"
            />
          </View>

          {/*Forgot Password */}
          <Button
            title="Forgot password!"
            /*onPress={this.handleSignUp}*/ color="#6a0dad"
          />

          {/*space*/}
          <View style={{ padding: width >= 375 && `${width * 0.013}%` }} />

          {/*Third Party Providers*/}
          <Text style={styles.centerText}>Sign in with</Text>
          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          >
            <TouchableOpacity onPress={this.checkFaceBookValidity}>
              <Image
                source={
                  __DEV__
                    ? require("../assets/images/facebookBW.png")
                    : require("../assets/images/facebookBW.png")
                }
                style={styles.iconImage}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.checkGoogleValidity}>
              <Image
                source={
                  __DEV__
                    ? require("../assets/images/googleBW.png")
                    : require("../assets/images/googleBW.png")
                }
                style={styles.iconImage}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.checkTwitterValidity}>
              <Image
                source={
                  __DEV__
                    ? require("../assets/images/TwitterBW.png")
                    : require("../assets/images/TwitterBW.png")
                }
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>

          {/*Testing USE*/}
          <View style={{ position: "absolute", left: 0, top: "5%" }}>
            <Button
              title="LOCATIONS"
              onPress={() => {
                this.props.SetGUIDAction({
                  guid: "5de42b16b4dc5b1fba94e1d4"
                  //guid: "5e119b146ebb5e4b3c2fff6f"
                });
                this.props.SetAboutYouDataAction({
                  firstName: "te st",
                  lastName: "",
                  birthDate: "",
                  gender: "",
                  country: "",
                  zipCode: ""
                });
                this.props.navigation.navigate("LocationServices");
              }}
            />
          </View>

          {/*Testing USE*/}
          <View style={{ position: "absolute", left: 0, top: "10%" }}>
            <Button
              title="LINKS"
              //If Navigate to Profile, in side linkscreen has set a guid
              onPress={() => {
                this.props.SetGUIDAction({
                  guid: "5de42b16b4dc5b1fba94e1d4"
                  //guid: "5e119b146ebb5e4b3c2fff6f"
                });
                this.props.SetAboutYouDataAction({
                  firstName: "KaChi",
                  lastName: "",
                  birthDate: "",
                  gender: "",
                  country: "",
                  zipCode: ""
                });
                this.props.navigation.navigate("Links");
              }}
            />
          </View>
          {/*Testing USE*/}
          <View style={{ position: "absolute", left: 0, top: "15%" }}>
            <Button
              title="HOME - USER_A"
              onPress={() => {
                //TESTING USE (TEMP)
                //Set Device user GUID
                this.props.SetGUIDAction({
                  //abc
                  //guid: "5e0f04d2ed63ee02f3999dea"
                  //One, Number
                  guid: "5e2bf53d2353214d94dd137e"
                  //guid: "5e119b146ebb5e4b3c2fff6f"
                });
                this.props.SetAboutYouDataAction({
                  firstName: "An",
                  lastName: "",
                  birthDate: "",
                  gender: "",
                  country: "",
                  zipCode: ""
                });
                //TESTING USE
                this.props.navigation.navigate("PreSettings");
              }}
            />
          </View>
          {/*Testing USE*/}
          <View style={{ position: "absolute", left: 0, top: "20%" }}>
            <Button
              title="HOME - USER_B"
              onPress={() => {
                //TESTING USE (TEMP)
                //Set Device user GUID
                this.props.SetGUIDAction({
                  //bbb
                  //guid: "5e0feb18efe16e02ee55c906"
                  //Two, Number
                  guid: "5e2bf60b2353214d94dd137f"
                  //guid: "5e119b146ebb5e4b3c2fff6f"
                });
                this.props.SetAboutYouDataAction({
                  firstName: "BBB",
                  lastName: "",
                  birthDate: "",
                  gender: "",
                  country: "",
                  zipCode: ""
                });
                //TESTING USE
                this.props.navigation.navigate("PreSettings");
              }}
            />
          </View>
          {/*Testing USE*/}
          <View style={{ position: "absolute", left: 0, top: "25%" }}>
            <Button
              title="Reset"
              onPress={() => {
                this.resetMatchStatus();
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }

  resetMatchStatus = () => {
    fetch(`${server_auth}/api/chat/kachi`, {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        console.log(res);
        return res;
      })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

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
  welcomeContainer: {
    alignItems: "center"
  },
  welcomeImage: {
    width: width * 0.53,
    height: width * 0.53,
    resizeMode: "contain"
  },
  formContainer: {
    justifyContent: "center",
    width: `${width * 0.18}%`,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    color: "#6a0dad",
    borderColor: "#6a0dad"
  },
  buttonStyle: {
    borderRadius: 20,
    color: "white",
    backgroundColor: "#6a0dad",
    paddingLeft: width * 0.26,
    paddingRight: width * 0.26,
    alignSelf: "center",
    fontStyle: "italic",
    margin: 5
  },
  buttonStyleOutline: {
    borderRadius: 20,
    color: "#6a0dad",
    borderWidth: 0.5,
    borderColor: "#6a0dad",
    paddingLeft: width * 0.26,
    paddingRight: width * 0.26,
    alignSelf: "center",
    fontStyle: "italic",
    margin: 5
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  },
  centerText: {
    marginTop: 15,
    textAlign: "center",
    color: "#6a0dad"
  },
  iconImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    padding: 10,
    margin: 20
  }
});
const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  SetAboutYouDataAction: payload => dispatch(SetAboutYouDataAction(payload)),
  SetGUIDAction: payload => dispatch(SetGUIDAction(payload)),
  SetFbDataAction: payload => dispatch(SetFbDataAction(payload)),
  SetJwtAction: payload => dispatch(SetJwtAction(payload)),
  SetIsContinueUserAction: payload =>
    dispatch(SetIsContinueUserAction(payload)),
  SetChecklistAction: payload => dispatch(SetChecklistAction(payload)),
  ResetReduxDataAction: payload => dispatch(ResetReduxDataAction(payload)),
  SetIsThirdPartyServicesUserAction: payload =>
    dispatch(SetIsThirdPartyServicesUserAction(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
