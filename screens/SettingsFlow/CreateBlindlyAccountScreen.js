import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { miniServer, localhost } from "../../config/ipconfig";
const { height, width } = Dimensions.get("window");

//Expo
import * as Expo from "expo";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { Notifications } from "expo";
import Constants from "expo-constants";

//Icons
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

var jwtDecode = require("jwt-decode");

//Shared Components
import FailScreen from "../ProfileFlow/Profile_SharedComponents/FailScreen";
import NextButton from "../ProfileFlow/Profile_SharedComponents/NextButton";
//Checker Functions
import {
  emailCheck,
  nullCheck,
  passwordLength,
  passwordCase,
  passwordNonLetter,
  passwordCheck
} from "../ProfileFlow/Profile_Registration/Util/RegistrationScreenCheckers.js";

//Warning Texts
import {
  emptyPasswordWarning,
  invalidPasswordWarning,
  invalidConfirmPasswordWarning,
  incorrectPasswordWarning
} from "../ProfileFlow/Profile_Registration/Util/RegistrationScreenWarnings.js";

//Push Notification Permission
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  global.deviceToken = await Notifications.getExpoPushTokenAsync();
  console.log("Heres your Device ID", global.deviceToken);
  // POST the token to your backend server from where you can retrieve it to send push notifications.
}

//Location Permission
async function registerForLocationAsync() {
  console.log("asking permission");
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== "granted") {
    this.setState({
      errorMessage: "Permission to access location was denied"
    });
  }
  console.log("getting location");
  let location = await Location.getCurrentPositionAsync({});
  global.currentLatLong =
    location.coords.latitude + "," + location.coords.longitude;
  global.currentAltitude = location.coords.altitude;
  console.log("Heres your position", global.currentLatLong);
  console.log("Heres your altitude", global.currentAltitude);
  // POST the token to your backend server from where you can retrieve it to send push notifications.
}

class CreateBlindlyAccountScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      passwordWarning: "empty",
      confirmPasswordWarning: "empty",
      password_UpperLowerCaseWarning: true,
      password_NumberSymbolWarning: true,
      password_LengthWarning: true,
      passed: false
    };
  }

  createAccount = () => {
    console.log("Create Account");
    fetch(`http://${localhost}:4000/api/profile/insertFor3rd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        data: {
          email: this.state.email,
          password: this.state.password,
          isAdmin: false,
          phoneNumber: "",
          deviceID: global.deviceToken,
          deviceLatLong: global.currentLatLong,
          deviceAltitude: global.currentAltitude
        }
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.success) {
          Alert.alert(
            "Success!",
            "Your Account is created. Welcome to BlindlyDate",
            [
              {
                text: "OK",
                onPress: () => {
                  this.props.navigation.goBack();
                }
              }
            ],
            { cancelable: false }
          );
        } else if (!res.success && res.status === 409) {
          alert(
            "This email has been used. Please contact us if you didn't use this email"
          );
        } else {
          throw new Error("Internal Error ");
        }
      })
      .catch(err => {
        alert("Ops! Some error occured. Please try again!");
      });
  };

  passwordChecker = () => {
    this.confirmPasswordInput.clear();
    //Clear password Input if any changes made to password input
    this.setState({
      confirmPasswordWarning: "empty"
    });
    if (!nullCheck(this.state.password)) {
      this.setState({
        passwordWarning: "empty",
        password_UpperLowerCaseWarning: true,
        password_NumberSymbolWarning: true,
        password_LengthWarning: true
      });
    } else if (!passwordCheck(this.state.password)) {
      let pLength = !passwordLength(this.state.password);
      let pLetterCase = !passwordCase(this.state.password);
      let pNonLetter = !passwordNonLetter(this.state.password);
      this.setState({
        passwordWarning: "invalid",
        password_UpperLowerCaseWarning: pLetterCase,
        password_NumberSymbolWarning: pNonLetter,
        password_LengthWarning: pLength
      });
    } else {
      this.setState({
        passwordWarning: "",
        password_UpperLowerCaseWarning: false,
        password_NumberSymbolWarning: false,
        password_LengthWarning: false
      });
    }
  };

  confirmPasswordChecker = () => {
    if (!nullCheck(this.state.confirmPassword)) {
      this.setState({
        confirmPasswordWarning: "empty"
      });
    } else if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        confirmPasswordWarning: "notmatch"
      });
    } else {
      this.setState({
        confirmPasswordWarning: ""
      });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)
    if (
      this.state.passwordWarning !== prevState.passwordWarning ||
      this.state.confirmPasswordWarning !== prevState.confirmPasswordWarning
    ) {
      this.allChecker();
    }
  }

  //control next button style and next screen
  allChecker = () => {
    if (
      this.state.passwordWarning === "" &&
      this.state.confirmPasswordWarning === ""
    ) {
      this.setState({
        passed: true
      });
    } else {
      this.setState({
        passed: false
      });
    }
  };

  async componentDidMount() {
    if (Constants.isDevice) {
      registerForPushNotificationsAsync();
      registerForLocationAsync();
    } else {
      console.log("Your are on a simulator, PUSH NOTIFICATIONS DISABLED");
    }
    let jwt = "";
    jwt = await this.props.CreateThirdPartyDataReducer.JWT;
    if (jwt !== null) {
      const decodedToken = jwtDecode(jwt);
      let { email } = decodedToken;

      if (email === "" || email === undefined || email === null) {
        Alert.alert(
          "Warning!",
          "Invalid Email",
          [
            {
              text: "OK",
              onPress: () => {
                this.props.navigation.goBack();
              }
            }
          ],
          { cancelable: false }
        );
      }

      this.setState({ email });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.inner}>
          {/*Spaces*/}
          <View style={styles.space} />

          {/**email */}
          <View style={{ width: "100%" }}>
            <Input
              placeholder="email"
              placeholderTextColor="rgb(67, 33, 140)"
              inputStyle={styles.inputStyle}
              value={this.state.email}
              editable={false}
            />
          </View>
          {/*Spaces*/}
          <View style={styles.space} />

          {/**password*/}
          <View>
            <Input
              placeholder="password"
              placeholderTextColor="rgb(67, 33, 140)"
              inputStyle={styles.inputStyle}
              value={this.state.password}
              returnKeyType="done"
              rightIcon={
                this.state.passwordWarning === "" ? (
                  <Icon
                    type="font-awesome"
                    name="check"
                    color="rgb(67, 33, 140)"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="rgb(67, 33, 140)"
                  />
                )
              }
              autoCompleteType={"off"}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={password =>
                this.setState({ password }, () => {
                  this.passwordChecker();
                })
              }
            />
            {this.state.passwordWarning === "empty" && emptyPasswordWarning}
            {this.state.passwordWarning === "invalid" && invalidPasswordWarning}
          </View>
          {/*Spaces*/}
          <View style={styles.space} />

          {/**confirmPassword*/}
          <View>
            <Input
              placeholder="confirmPassword"
              placeholderTextColor="rgb(67, 33, 140)"
              inputStyle={styles.inputStyle}
              value={this.state.confirmPassword}
              returnKeyType="done"
              rightIcon={
                this.state.confirmPasswordWarning === "" ? (
                  <Icon
                    type="font-awesome"
                    name="check"
                    color="rgb(67, 33, 140)"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="rgb(67, 33, 140)"
                  />
                )
              }
              autoCompleteType={"off"}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              ref={input => {
                this.confirmPasswordInput = input;
              }}
              onChangeText={confirmPassword =>
                this.setState({ confirmPassword }, () => {
                  this.confirmPasswordChecker();
                })
              }
            />
            {this.state.confirmPasswordWarning === "empty" &&
              emptyPasswordWarning}
            {this.state.confirmPasswordWarning === "notmatch" &&
              invalidConfirmPasswordWarning}
          </View>
          {/*Spaces*/}
          <View style={styles.space} />

          {/*Password Hints Box*/}
          <View style={styles.passwordHintWrap}>
            {/*Password Hints Text*/}
            <View style={styles.passwordHintTextWrap}>
              {this.state.password_UpperLowerCaseWarning ? (
                <Icon name="times" type="font-awesome" color="red" />
              ) : (
                <Icon
                  name="check"
                  type="font-awesome"
                  color="rgb(67, 33, 140)"
                />
              )}
              <Text style={styles.passwordHintText}>
                {"   "}
                include upper and lower case
              </Text>
            </View>

            {/*Password Hints Text*/}
            <View style={styles.passwordHintTextWrap}>
              {this.state.password_NumberSymbolWarning ? (
                <Icon name="times" type="font-awesome" color="red" />
              ) : (
                <Icon
                  name="check"
                  type="font-awesome"
                  color="rgb(67, 33, 140)"
                />
              )}
              <Text style={styles.passwordHintText}>
                {"   "}
                include at least a number or symbol
              </Text>
            </View>

            {/*Password Hints Text*/}
            <View style={styles.passwordHintTextWrap}>
              {this.state.password_LengthWarning ? (
                <Icon name="times" type="font-awesome" color="red" />
              ) : (
                <Icon
                  name="check"
                  type="font-awesome"
                  color="rgb(67, 33, 140)"
                />
              )}
              <Text style={styles.passwordHintText}>
                {"   "}
                be at least 8 characters long
              </Text>
            </View>
          </View>
          {/*Spaces*/}
          <View style={styles.space} />

          {/*Next Button*/}
          <NextButton
            passed={this.state.passed}
            handleSubmit={this.createAccount}
          />

          {/*Spaces*/}
          <View style={styles.space} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: "5%",
    marginRight: "5%"
  },
  input: {
    height: 40,
    borderColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  inputStyle: {
    color: "rgb(67, 33, 140)",
    fontSize: Math.round(width / 28.84)
  },
  passwordHintTextWrap: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  passwordHintText: {
    color: "rgb(67, 33, 140)",
    paddingVertical: 5,
    fontSize: Math.round(width / 26.78)
  },
  passwordHintWrap: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgb(67, 33, 140)",
    padding: "3%"
  },
  space: {
    padding: "3%"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBlindlyAccountScreen);
