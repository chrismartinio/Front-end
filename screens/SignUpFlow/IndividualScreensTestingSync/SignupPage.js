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
  ImageBackground
} from "react-native";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import SetUserDataAction from "../../../storage/actions/SetUserDataAction";
import firebase from "../../../utils/mainFire";
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

class Welcome extends Component {
  static navigationOptions = {
    //header: null,
    //title: 'Match Chat',
    headerStyle: {
      backgroundColor: "#18cdf6"
    },
    footerStyle: {
      backgroundColor: "#fff"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 24
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      confirmEmail: "",
      password: "",
      confrimPassword: "",
      emailWarning: "empty",
      confirmEmailWarning: "empty",
      passwordWarning: "empty",
      confirmPasswordWarning: "empty",
      password_UpperLowerCaseWarning: true,
      password_NumberSymbolWarning: true,
      password_LengthWarning: true
    };
  }
  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  emailCheck = email => {
    // email validty check?
    const checkAT = email.indexOf("@");
    const checkCOM = email.indexOf(".com");
    if (checkAT > 0 && checkCOM > 0 && email.length > 4) {
      return true;
    }
    return false;
  };

  passwordLength = password => {
    if (!(password.length >= 8)) {
      console.log("password less than 8");
      return false;
    }
    return true;
  };

  passworcdCase = password => {
    // use positive look ahead to see if at least one lower case letter exists
    //let regExp = /^(?=.*[a-z])/;
    // use positive look ahead to see if at least one upper case letter exists
    //regExp = /^(?=.*[A-Z])/;
    if (!(/^(?=.*[a-z])/.test(password) && /^(?=.*[A-Z])/.test(password))) {
      console.log("not including any lower and upper case");
      return false;
    }
    return true;
  };

  passwordNonLetter = password => {
    // use positive look ahead to see if at least one digit exists
    //let regExp = /^(?=.*[0-9])/;
    // use positive look ahead to see if at least one non-word character exists
    //regExp = /^(?=.*\W)/;
    if (!(/^(?=.*[0-9])/.test(password) || /^(?=.*\W)/.test(password))) {
      console.log("not including at least one digit or symbol");
      return false;
    }
    return true;
  };
  passwordCheck = password => {
    let pLength = this.passwordLength(password);
    let pCase = this.passworcdCase(password);
    let pNonLetter = this.passwordNonLetter(password);

    if (pLength === false) {
      return false;
    }
    if (pCase === false) {
      return false;
    }
    if (pNonLetter === false) {
      return false;
    }

    return true;
  };

  nullCheck = value => {
    if (value !== "") {
      return true;
    }
    return false;
  };

  handleSubmit = () => {
    let email = false,
      password = false;

    //check Invalid/Empty/Confirm Email
    if (!this.nullCheck(this.state.email)) {
      console.log("Empty Email");
      email = false;
      this.setState({
        emailWarning: "empty"
      });
    } else if (!this.emailCheck(this.state.email)) {
      console.log("Invalid Email");
      email = false;
      this.setState({
        emailWarning: "invalid"
      });
    } else if (!this.nullCheck(this.state.confirmEmail)) {
      console.log("Empty Confirm Email");
      email = false;
      this.setState({
        emailWarning: "",
        confirmEmailWarning: "empty"
      });
    } else if (this.state.email !== this.state.confirmEmail) {
      console.log("Email and Confirm Email not match");
      email = false;
      this.setState({
        emailWarning: "",
        confirmEmailWarning: "notmatch"
      });
    } else {
      email = true;
      this.setState({
        emailWarning: "",
        confirmEmailWarning: ""
      });
    }

    //check Invalid/Empty/Confirm Password
    if (!this.nullCheck(this.state.password)) {
      console.log("Empty Password");
      password = false;
      this.setState({
        passwordWarning: "empty",
        password_UpperLowerCaseWarning: true,
        password_NumberSymbolWarning: true,
        password_LengthWarning: true
      });
    } else if (!this.passwordCheck(this.state.password)) {
      console.log("Invalid Password");
      password = false;
      let pLength = !this.passwordLength(this.state.password);
      let pLetterCase = !this.passworcdCase(this.state.password);
      let pNonLetter = !this.passwordNonLetter(this.state.password);
      this.setState({
        passwordWarning: "invalid",
        password_UpperLowerCaseWarning: pLetterCase,
        password_NumberSymbolWarning: pNonLetter,
        password_LengthWarning: pLength
      });
    } else if (!this.nullCheck(this.state.confirmPassword)) {
      console.log("Empty Confirm Password");
      password = false;
      this.setState({
        passwordWarning: "",
        confirmPasswordWarning: "empty",
        password_UpperLowerCaseWarning: false,
        password_NumberSymbolWarning: false,
        password_LengthWarning: false
      });
    } else if (this.state.password !== this.state.confirmPassword) {
      console.log("Password and Confirm Password not match");
      password = false;
      this.setState({
        passwordWarning: "",
        confirmPasswordWarning: "notmatch",
        password_UpperLowerCaseWarning: false,
        password_NumberSymbolWarning: false,
        password_LengthWarning: false
      });
    } else {
      password = true;
      this.setState({
        passwordWarning: "",
        confirmPasswordWarning: "",
        password_UpperLowerCaseWarning: false,
        password_NumberSymbolWarning: false,
        password_LengthWarning: false
      });
    }

    if (email && password) {
      console.log("Passed");

      this.props.SetUserDataAction({
        email: this.state.email,
        password: this.state.password
      });
      this.props.navigation.navigate("TestAboutYou");
    }
  };
  render() {
    let empty = <Text style={styles.warningText}>error: empty field</Text>;

    let invalidEmailWarning = (
      <Text style={styles.warningText}>* error: invalid Email</Text>
    );

    let invalidConfirmEmailWarning = (
      <Text style={styles.warningText}>* error: emails don't match</Text>
    );

    let invalidPasswordWarning = (
      <Text style={styles.warningText}>* error: invalid Password</Text>
    );

    let invalidConfirmPasswordWarning = (
      <Text style={styles.warningText}>* error: passwords don't match</Text>
    );

    let allEmptyWarning =
      this.state.emailWarning === "empty" ||
      this.state.confirmEmailWarning === "empty" ||
      this.state.passwordWarning === "empty" ||
      this.state.confirmPasswordWarning === "empty";

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <LinearGradient
          textStyle={{ color: "#fff" }}
          colors={["#18cdf6", "#43218c"]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inner}>
                <Text style={styles.titleText}>Sign Up</Text>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />
                {/**email */}
                <View style={{ width: "100%" }}>
                  <Input
                    placeholder="email"
                    placeholderTextColor="#fff"
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    rightIcon={
                      this.state.emailWarning === ""
                        ? {
                            type: "font-awesome",
                            name: "check",
                            color: "orange"
                          }
                        : {
                            type: "font-awesome",
                            name: "exclamation-circle",
                            color: "#FF4500"
                          }
                    }
                    autoCompleteType={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={email => this.setState({ email })}
                  />
                  {this.state.emailWarning === "empty" && empty}
                  {this.state.emailWarning === "invalid" && invalidEmailWarning}
                </View>

                {/**confirm email*/}
                <View>
                  <Input
                    placeholder="confirm email"
                    placeholderTextColor="#fff"
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    rightIcon={
                      this.state.confirmEmailWarning === ""
                        ? {
                            type: "font-awesome",
                            name: "check",
                            color: "orange"
                          }
                        : {
                            type: "font-awesome",
                            name: "exclamation-circle",
                            color: "#FF4500"
                          }
                    }
                    autoCompleteType={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={confirmEmail =>
                      this.setState({ confirmEmail })
                    }
                  />
                  {this.state.confirmEmailWarning === "empty" && empty}
                  {this.state.confirmEmailWarning === "notmatch" &&
                    invalidConfirmEmailWarning}
                </View>

                {/**password*/}
                <View>
                  <Input
                    placeholder="password"
                    placeholderTextColor="#fff"
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    rightIcon={
                      this.state.passwordWarning === ""
                        ? {
                            type: "font-awesome",
                            name: "check",
                            color: "orange"
                          }
                        : {
                            type: "font-awesome",
                            name: "exclamation-circle",
                            color: "#FF4500"
                          }
                    }
                    autoCompleteType={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={password => this.setState({ password })}
                  />
                  {this.state.passwordWarning === "empty" && empty}
                  {this.state.passwordWarning === "invalid" &&
                    invalidPasswordWarning}
                </View>

                {/**confirm password*/}
                <View>
                  <Input
                    placeholder="confirmPassword"
                    placeholderTextColor="#fff"
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    rightIcon={
                      this.state.confirmPasswordWarning === ""
                        ? {
                            type: "font-awesome",
                            name: "check",
                            color: "orange"
                          }
                        : {
                            type: "font-awesome",
                            name: "exclamation-circle",
                            color: "#FF4500"
                          }
                    }
                    autoCompleteType={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={confirmPassword =>
                      this.setState({ confirmPassword })
                    }
                  />
                  {this.state.confirmPasswordWarning === "empty" && empty}
                  {this.state.confirmPasswordWarning === "notmatch" &&
                    invalidConfirmPasswordWarning}
                </View>

                {/*Spaces*/}
                <View
                  style={{
                    padding: "3%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                <View
                  style={{
                    borderRadius: 4,
                    borderWidth: 0.5,
                    borderColor: "#d6d7da",
                    padding: "3%"
                  }}
                >
                  <View
                    style={{
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      flexDirection: "row"
                    }}
                  >
                    {this.state.password_UpperLowerCaseWarning ? (
                      <Icon name="times" type="font-awesome" color="red" />
                    ) : (
                      <Icon name="check" type="font-awesome" color="orange" />
                    )}
                    <Text style={{ color: "#fff", paddingVertical: 5 }}>
                      {"   "}
                      include upper and lower case
                    </Text>
                  </View>

                  <View
                    style={{
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      flexDirection: "row"
                    }}
                  >
                    {this.state.password_NumberSymbolWarning ? (
                      <Icon name="times" type="font-awesome" color="red" />
                    ) : (
                      <Icon name="check" type="font-awesome" color="orange" />
                    )}
                    <Text style={{ color: "#fff", paddingVertical: 5 }}>
                      {"   "}
                      include at least one number or symbol
                    </Text>
                  </View>

                  <View
                    style={{
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      flexDirection: "row"
                    }}
                  >
                    {this.state.password_LengthWarning ? (
                      <Icon name="times" type="font-awesome" color="red" />
                    ) : (
                      <Icon name="check" type="font-awesome" color="orange" />
                    )}
                    <Text style={{ color: "#fff", paddingVertical: 5 }}>
                      {"   "}
                      be at least 8 characters long
                    </Text>
                  </View>
                </View>

                {/*Spaces*/}
                <View
                  style={{
                    padding: "2%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {allEmptyWarning && (
                  <Text style={styles.warningText}>*all fields required</Text>
                )}
                <Text />
                <View alignItems="center">
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={this.handleSubmit}
                  >
                    <Text style={styles.button}>Next</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  },
  button: {
    color: "#fff",
    fontSize: 20
  },
  _textInput: {
    color: "#fff",
    fontSize: 20,
    textAlign: "left",
    paddingTop: "20%",
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  smallText: {
    margin: 10,
    color: "#fff",
    fontSize: 10
  },
  titleText: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  button2: {
    alignItems: "center",
    //backgroundColor: '#fff',
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1
  },
  inputContainerStyle: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  inputStyle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "100"
  },
  warningText: {
    color: "red",
    fontSize: 10,
    paddingTop: "3%",
    fontWeight: "bold"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetUserDataAction: payload => dispatch(SetUserDataAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
