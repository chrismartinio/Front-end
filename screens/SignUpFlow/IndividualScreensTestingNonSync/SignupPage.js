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
      emailWarning: "",
      passwordWarning: ""
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
    if (password.length > 6) {
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
    } else if (this.state.email !== this.state.confirmEmail) {
      console.log("Email and Confirm Email not match");
      email = false;
      this.setState({
        emailWarning: "notmatch"
      });
    } else {
      email = true;
      this.setState({
        emailWarning: ""
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
    } else if (this.state.password !== this.state.confirmPassword) {
      console.log("Password and Confirm Password not match");
      password = false;
      this.setState({
        passwordWarning: "notmatch"
      });
    } else {
      password = true;
      this.setState({
        passwordWarning: ""
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
                <TextInput
                  style={styles._textInput}
                  placeholder="email"
                  placeholderTextColor="#fff"
                  onChangeText={email => this.setState({ email })}
                  autoCompleteType={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  //value={this.state.email}
                />
                <TextInput
                  style={styles._textInput}
                  placeholder="confirm email"
                  placeholderTextColor="#fff"
                  onChangeText={confirmEmail => this.setState({ confirmEmail })}
                  autoCompleteType={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TextInput
                  style={styles._textInput}
                  placeholder="password"
                  placeholderTextColor="#fff"
                  onChangeText={password => this.setState({ password })}
                  autoCompleteType={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                />
                <TextInput
                  style={styles._textInput}
                  placeholder="confrim password"
                  placeholderTextColor="#fff"
                  onChangeText={confirmPassword =>
                    this.setState({ confirmPassword })
                  }
                  autoCompleteType={false}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  autoCorrect={false}
                />
                <Text style={styles.smallText}>*all fields required</Text>
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
