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
//Icons
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

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

class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      oldPasswordWarning: "empty",
      newPasswordWarning: "empty",
      confirmNewPasswordWarning: "empty",
      newPassword_UpperLowerCaseWarning: true,
      newPassword_NumberSymbolWarning: true,
      newPassword_LengthWarning: true,
      passed: false
    };
  }

  changePassword = () => {
    console.log("change password");
    fetch(`http://${localhost}:4000/api/profile/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "createAccount",
        data: {
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword
        }
      })
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success && res.status === 422) {
          return this.setState({
            oldPasswordWarning: "invalid"
          });
        }

        if (!res.success && res.status === 500) {
          throw new Error("Internal Error ");
        }

        if (res.success) {
          Alert.alert(
            "Success!",
            "Your password has changed.",
            [
              {
                text: "OK",
                onPress: () => {}
              }
            ],
            { cancelable: false }
          );
          this.setState(
            {
              oldPassword: "",
              newPassword: "",
              confirmNewPassword: "",
              oldPasswordWarning: "empty",
              newPasswordWarning: "empty",
              confirmNewPasswordWarning: "empty",
              newPassword_UpperLowerCaseWarning: true,
              newPassword_NumberSymbolWarning: true,
              newPassword_LengthWarning: true,
              passed: false
            },
            () => {
              this.props.navigation.goBack();
            }
          );
        } else {
          throw new Error("Internal Error ");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Ops! Some error occured. Please try again!");
      });
  };

  oldPasswordChecker = () => {
    if (!nullCheck(this.state.oldPassword)) {
      this.setState({
        oldPasswordWarning: "empty"
      });
    } else {
      this.setState({
        oldPasswordWarning: ""
      });
    }
  };

  newPasswordChecker = () => {
    this.confirmNewPasswordInput.clear();
    //Clear password Input if any changes made to password input
    this.setState({
      confirmNewPasswordWarning: "empty"
    });
    if (!nullCheck(this.state.password)) {
      this.setState({
        newPasswordWarning: "empty",
        newPassword_UpperLowerCaseWarning: true,
        newPassword_NumberSymbolWarning: true,
        newPassword_LengthWarning: true
      });
    } else if (!passwordCheck(this.state.newPassword)) {
      let pLength = !passwordLength(this.state.newPassword);
      let pLetterCase = !passwordCase(this.state.newPassword);
      let pNonLetter = !passwordNonLetter(this.state.newPassword);
      this.setState({
        newPasswordWarning: "invalid",
        newPassword_UpperLowerCaseWarning: pLetterCase,
        newPassword_NumberSymbolWarning: pNonLetter,
        newPassword_LengthWarning: pLength
      });
    } else {
      this.setState({
        newPasswordWarning: "",
        newPassword_UpperLowerCaseWarning: false,
        newPassword_NumberSymbolWarning: false,
        newPassword_LengthWarning: false
      });
    }
  };

  confirmPasswordChecker = () => {
    if (!nullCheck(this.state.confirmNewPassword)) {
      this.setState({
        confirmNewPasswordWarning: "empty"
      });
    } else if (this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({
        confirmNewPasswordWarning: "notmatch"
      });
    } else {
      this.setState({
        confirmNewPasswordWarning: ""
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
      this.state.newPasswordWarning !== prevState.newPasswordWarning ||
      this.state.confirmNewPasswordWarning !==
        prevState.confirmNewPasswordWarning ||
      this.state.oldPasswordWarning != prevState.oldPasswordWarning
    ) {
      this.allChecker();
    }
  }

  //control next button style and next screen
  allChecker = () => {
    if (
      this.state.newPasswordWarning === "" &&
      this.state.confirmNewPasswordWarning === "" &&
      this.state.oldPasswordWarning === ""
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

  componentDidMount() {
    //console.log(this.props.CreateProfileDataReducer.guid)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.inner}>
          {/*Spaces*/}
          <View style={styles.space} />

          {/**oldPassword*/}
          <View>
            <Input
              placeholder="old Password"
              placeholderTextColor="rgb(67, 33, 140)"
              inputStyle={styles.inputStyle}
              value={this.state.oldPassword}
              returnKeyType="done"
              rightIcon={
                this.state.oldPasswordWarning === "" ? (
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
              onChangeText={oldPassword =>
                this.setState({ oldPassword }, () => {
                  this.oldPasswordChecker();
                })
              }
            />
            {this.state.oldPasswordWarning === "empty" && emptyPasswordWarning}
            {this.state.oldPasswordWarning === "invalid" &&
              incorrectPasswordWarning}
          </View>
          {/*Spaces*/}
          <View style={styles.space} />

          {/**newPassword*/}
          <View>
            <Input
              placeholder="password"
              placeholderTextColor="rgb(67, 33, 140)"
              inputStyle={styles.inputStyle}
              value={this.state.newPassword}
              returnKeyType="done"
              rightIcon={
                this.state.newPasswordWarning === "" ? (
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
              onChangeText={newPassword =>
                this.setState({ newPassword }, () => {
                  this.newPasswordChecker();
                })
              }
            />
            {this.state.newPasswordWarning === "empty" && emptyPasswordWarning}
            {this.state.newPasswordWarning === "invalid" &&
              invalidPasswordWarning}
          </View>
          {/*Spaces*/}
          <View style={styles.space} />

          {/**confirmNewPassword*/}
          <View>
            <Input
              placeholder="confirmPassword"
              placeholderTextColor="rgb(67, 33, 140)"
              inputStyle={styles.inputStyle}
              value={this.state.confirmNewPassword}
              returnKeyType="done"
              rightIcon={
                this.state.confirmNewPasswordWarning === "" ? (
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
                this.confirmNewPasswordInput = input;
              }}
              onChangeText={confirmNewPassword =>
                this.setState({ confirmNewPassword }, () => {
                  this.confirmPasswordChecker();
                })
              }
            />
            {this.state.confirmNewPasswordWarning === "empty" &&
              emptyPasswordWarning}
            {this.state.confirmNewPasswordWarning === "notmatch" &&
              invalidConfirmPasswordWarning}
          </View>
          {/*Spaces*/}
          <View style={styles.space} />

          {/*Password Hints Box*/}
          <View style={styles.passwordHintWrap}>
            {/*Password Hints Text*/}
            <View style={styles.passwordHintTextWrap}>
              {this.state.newPassword_UpperLowerCaseWarning ? (
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
              {this.state.newPassword_NumberSymbolWarning ? (
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
              {this.state.newPassword_LengthWarning ? (
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
            handleSubmit={this.changePassword}
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
)(ChangePasswordScreen);
