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
      confirmPasswordWarning: "empty"
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

  passwordCheck = password => {
    if (!(password.length >= 8)) {
      console.log("password less than 8")
      return false;
    }

    // use positive look ahead to see if at least one lower case letter exists
    //let regExp = /(?=.*[a-z])/;
    let regExp = /^(?=.*[a-z])/;
    if (!regExp.test(password)) {
      console.log("no lower case exist")
      return false;
    }

    // use positive look ahead to see if at least one upper case letter exists
    regExp = /^(?=.*[A-Z])/;
    if (!regExp.test(password)) {
      console.log("no upper case exist")
      return false;
    }

    // use positive look ahead to see if at least one digit exists
    regExp = /^(?=.*[0-9])/;
    if (!regExp.test(password)) {
      console.log("no at least one digit exist")
      return false;
    }

    // use positive look ahead to see if at least one non-word character exists
    regExp = /^(?=.*\W)/;
    if (!regExp.test(password)) {
      console.log("no at least one symbol exist")
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
        passwordWarning: "empty"
      });
    } else if (!this.passwordCheck(this.state.password)) {
      console.log("Invalid Password");
      password = false;
      this.setState({
        passwordWarning: "invalid"
      });
    } else if (!this.nullCheck(this.state.confirmPassword)) {
      console.log("Empty Confirm Password");
      password = false;
      this.setState({
        passwordWarning: "",
        confirmPasswordWarning: "empty"
      });
    } else if (this.state.password !== this.state.confirmPassword) {
      console.log("Password and Confirm Password not match");
      password = false;
      this.setState({
        passwordWarning: "",
        confirmPasswordWarning: "notmatch"
      });
    } else {
      password = true;
      this.setState({
        passwordWarning: "",
        confirmPasswordWarning: ""
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
                    padding: "20%"
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
                    rightIcon={{
                      type: "font-awesome",
                      name:
                        this.state.emailWarning === ""
                          ? "check"
                          : "exclamation",
                      color: "#fff"
                    }}
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
                    rightIcon={{
                      type: "font-awesome",
                      name:
                        this.state.confirmEmailWarning === ""
                          ? "check"
                          : "exclamation",
                      color: "#fff"
                    }}
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
                    rightIcon={{
                      type: "font-awesome",
                      name:
                        this.state.passwordWarning === ""
                          ? "check"
                          : "exclamation",
                      color: "#fff"
                    }}
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
                    rightIcon={{
                      type: "font-awesome",
                      name:
                        this.state.confirmPasswordWarning === ""
                          ? "check"
                          : "exclamation",
                      color: "#fff"
                    }}
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
