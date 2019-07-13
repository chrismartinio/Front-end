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
  ImageBackground,
  Separator, Thumbnail, List, ListItem,
} from "react-native";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import SetUserDataAction from "../../storage/actions/SetUserDataAction";
import firebase from "../../utils/mainFire";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import SignupPage from "./AccordianCollapse/SignupPage";
import AboutYou from "./AccordianCollapse/AboutYou";
import ImInterestedIn from "./AccordianCollapse/ImInterestedIn";
import TellUsMore from "./AccordianCollapse/TellUsMore";
import WouldRather from "./AccordianCollapse/WouldRather";
import SpendWeekend from "./AccordianCollapse/SpendAWeekend";
class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "email",
      emailCheck: "email",
      password: "password",
      passwordCheck: "password"
    };
  }
  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };
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
  SignUpToDatabase = ({ age, email, gender, name, password }) => {
    let userId = email.split(".").join();
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        age: age,
        email: email,
        gender: gender,
        name: name,
        password: password
      });
  };
  handleSubmit = () => {
    const value = this.state.email;
    const password = this.state.password;
    //console.log(nullCheck)//this.nullCheck(value);
    //console.log(value)
    const nullCheck = value => {
      if (value !== "email" && value !== "") {
        return true;
      }
      return false;
    };
    //console.log(nullCheck(value))
    const emailCheck = email => {
      // email validty check?
      const checkAT = email.indexOf("@");
      const checkCOM = email.indexOf(".com");
      if (checkAT > 0 && checkCOM > 0 && email.length > 4) {
        return true;
      }
      console.log("Please Properly insert a email with a '@' & a '.com'");
      return false;
    };

    const passwordCheck = password => {
      if (password.length > 6) {
        return true;
      }

      return false;
    };

    if (nullCheck(value) && emailCheck(value) && passwordCheck(password)) {
      console.log("yay");
      // for(let key in value){
      //   value[key] = JSON.stringify(value[key])
      // }
      // this.SignUpToDatabase(value)
      // this.props.SetProfilePersonalAction(value)
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
              <View>
    <Collapse>
      <CollapseHeader>
          <Text>Sign Up</Text>
      </CollapseHeader>
      <CollapseBody>
          <SignupPage/>
      </CollapseBody>
    </Collapse>
    <Collapse>
      <CollapseHeader>
          <Text>About You</Text>
      </CollapseHeader>
      <CollapseBody>
          <AboutYou/>
        
      </CollapseBody>
    </Collapse>
    <Collapse>
      <CollapseHeader>
          <Text>ImInterestedIn</Text>
      </CollapseHeader>
      <CollapseBody>
          <ImInterestedIn/>
        
      </CollapseBody>
    </Collapse>
    <Collapse>
      <CollapseHeader>
          <Text>TellUsMore</Text>
      </CollapseHeader>
      <CollapseBody>
          <TellUsMore/>
        
      </CollapseBody>
    </Collapse>
  
    <Collapse>
      <CollapseHeader>
          <Text>WouldRather</Text>
      </CollapseHeader>
      <CollapseBody>
          <WouldRather/>
        
      </CollapseBody>
    </Collapse>

    <Collapse>
      <CollapseHeader>
          <Text>SpendAWeekend</Text>
      </CollapseHeader>
      <CollapseBody>
          <SpendWeekend/>
        
      </CollapseBody>
    </Collapse>

  
  </View>
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
