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

class CreateAccount extends Component {
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
      password_LengthWarning: true,
      passed: false
    };
  }
  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)
    if (
      this.state.emailWarning !== prevState.emailWarning ||
      this.state.confirmEmailWarning !== prevState.confirmEmailWarning ||
      this.state.passwordWarning !== prevState.passwordWarning ||
      this.state.confirmPasswordWarning !== prevState.confirmPasswordWarning
    ) {
      this.allChecker();
    }
  }

  //format checkers below
  emailCheck = email => {
    // email validty check?
    const checkAT = email.indexOf("@");
    const checkCOM = email.indexOf(".com");
    if (checkAT > 0 && checkCOM > 0 && email.length > 4) {
      return true;
    }
    return false;
  };

  nullCheck = value => {
    if (value !== "") {
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
      console.log("not including any lower and upper cases");
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

  //format checkers above

  //check email
  emailChecker = () => {
    if (!this.nullCheck(this.state.email)) {
      console.log("Empty Email");
      this.setState({
        emailWarning: "empty"
      });
    } else if (!this.emailCheck(this.state.email)) {
      console.log("Invalid Email");
      this.setState({
        emailWarning: "invalid"
      });
    } else {
      this.setState({
        emailWarning: ""
      });
    }
  };

  confirmEmailChecker = () => {
    if (!this.nullCheck(this.state.confirmEmail)) {
      console.log("Empty Confirm Email");
      this.setState({
        confirmEmailWarning: "empty"
      });
    } else if (this.state.email !== this.state.confirmEmail) {
      console.log("Email and Confirm Email not match");
      this.setState({
        confirmEmailWarning: "notmatch"
      });
    } else {
      this.setState({
        confirmEmailWarning: ""
      });
    }
  };

  passwordChecker = () => {
    if (!this.nullCheck(this.state.password)) {
      console.log("Empty Password");
      this.setState({
        passwordWarning: "empty",
        password_UpperLowerCaseWarning: true,
        password_NumberSymbolWarning: true,
        password_LengthWarning: true
      });
    } else if (!this.passwordCheck(this.state.password)) {
      console.log("Invalid Password");
      let pLength = !this.passwordLength(this.state.password);
      let pLetterCase = !this.passworcdCase(this.state.password);
      let pNonLetter = !this.passwordNonLetter(this.state.password);
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
    if (!this.nullCheck(this.state.confirmPassword)) {
      console.log("Empty Confirm Password");
      password = false;
      this.setState({
        confirmPasswordWarning: "empty"
      });
    } else if (this.state.password !== this.state.confirmPassword) {
      console.log("Password and Confirm Password not match");
      password = false;
      this.setState({
        confirmPasswordWarning: "notmatch"
      });
    } else {
      password = true;
      this.setState({
        confirmPasswordWarning: ""
      });
    }
  };

  //control next button style and next screen
  allChecker = () => {
    if (
      this.state.emailWarning === "" &&
      this.state.confirmEmailWarning === "" &&
      this.state.passwordWarning === "" &&
      this.state.confirmPasswordWarning === ""
    ) {
      this.setState(
        {
          passed: true
        },
        () => {
          console.log("passed");
        }
      );
    } else {
      this.setState(
        {
          passed: false
        },
        () => {
          console.log("not passed");
        }
      );
    }
  };

  handleSubmit = () => {
    if (this.state.passed) {
      this.props.SetUserDataAction({
        email: this.state.email,
        password: this.state.password
      });
      //this.props.navigation.navigate("TestAboutYou");
      this.props.handleScreenPassed("createAccountPassed", true)
    } else {
      this.props.handleScreenPassed("createAccountPassed", false)
    }
  };

  render() {
    let emptyEmail = (
      <Text style={styles.warningText}>* Please enter a email</Text>
    );
    let emptyPassword = (
      <Text style={styles.warningText}>* Please enter a password</Text>
    );

    let invalidEmailWarning = (
      <Text style={styles.warningText}>
        * Please enter a valid email address
      </Text>
    );

    let invalidConfirmEmailWarning = (
      <Text style={styles.warningText}>* Email address does not match</Text>
    );

    let invalidPasswordWarning = (
      <Text style={styles.warningText}>* Please enter a valid password</Text>
    );

    let invalidConfirmPasswordWarning = (
      <Text style={styles.warningText}>* Password does not match</Text>
    );

    let allEmptyWarning =
      this.state.emailWarning === "empty" ||
      this.state.confirmEmailWarning === "empty" ||
      this.state.passwordWarning === "empty" ||
      this.state.confirmPasswordWarning === "empty";

    return (
      <View style={{ flex: 1 }}>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
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
              this.state.emailWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            autoCompleteType={false}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email =>
              this.setState({ email }, () => {
                this.emailChecker();
              })
            }
          />
          {this.state.emailWarning === "empty" && emptyEmail}
          {this.state.emailWarning === "invalid" && invalidEmailWarning}
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

        {/**confirm email*/}
        <View>
          <Input
            placeholder="confirm email"
            placeholderTextColor="#fff"
            containerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            rightIcon={
              this.state.confirmEmailWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            autoCompleteType={false}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={confirmEmail =>
              this.setState({ confirmEmail }, () => {
                this.confirmEmailChecker();
              })
            }
          />
          {this.state.confirmEmailWarning === "empty" && emptyEmail}
          {this.state.confirmEmailWarning === "notmatch" &&
            invalidConfirmEmailWarning}
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

        {/**password*/}
        <View>
          <Input
            placeholder="password"
            placeholderTextColor="#fff"
            containerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            rightIcon={
              this.state.passwordWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            autoCompleteType={false}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={password =>
              this.setState({ password }, () => {
                this.passwordChecker();
              })
            }
          />
          {this.state.passwordWarning === "empty" && emptyPassword}
          {this.state.passwordWarning === "invalid" && invalidPasswordWarning}
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

        {/**confirm password*/}
        <View>
          <Input
            placeholder="confirmPassword"
            placeholderTextColor="#fff"
            containerStyle={styles.inputContainerStyle}
            inputStyle={styles.inputStyle}
            rightIcon={
              this.state.confirmPasswordWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            autoCompleteType={false}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={confirmPassword =>
              this.setState({ confirmPassword }, () => {
                this.confirmPasswordChecker();
              })
            }
          />
          {this.state.confirmPasswordWarning === "empty" && emptyPassword}
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
            borderColor: "#fff",
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
              include at least a number or symbol
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
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/*Next Button*/}
        <View
          alignItems="center"
          style={{ opacity: this.state.passed ? 1.0 : 0.5 }}
        >
          <TouchableOpacity
            style={styles.nextButton}
            onPress={this.handleSubmit}
          >
            <Text style={styles.button}>Next</Text>
          </TouchableOpacity>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  button: {
    color: "#fff",
    fontSize: 20
  },
  nextButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
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
    color: "#fff",
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
)(CreateAccount);
