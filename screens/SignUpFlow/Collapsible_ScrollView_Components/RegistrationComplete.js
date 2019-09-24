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
  Separator,
  Thumbnail,
  List,
  ListItem
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient'


import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

class RegistrationComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccountToggle: false,
      aboutYouToggle: false,
      preferencesToggle: false,
      interestsToggle: false,
      wouldYouRatherToggle: false,
      localDestinationsToggle: false,
      createAccountPassed: false,
      aboutYouPassed: false,
      preferencesPassed: false,
      interestsPassed: false,
      wouldYouRatherPassed: false,
      localDestinationsPassed: false
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

  render() {
    return (
      <LinearGradient
        textStyle={{ color: "#fff" }}
        colors={["#18cdf6", "#43218c"]}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 24, color: "#fff" }}>
            Welcome to Blindly
          </Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "3%"
              //borderRadius: 4,
              //borderWidth: 0.5,
              //borderColor: "#d6d7da"
            }}
          />

          {/*Back Button*/}
          <View alignItems="center">
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("SignIn");
              }}
            >
              <Text style={styles.button}>Back to Login</Text>
            </TouchableOpacity>
            <Text />
          </View>

          {/*Continue Button*/}
          <View alignItems="center">
            <TouchableOpacity
              onPress={() => {
                //this.props.navigation.navigate("TestRegistrationComplete");
              }}
            >
              <Text style={styles.button}>Continue to Profile</Text>
            </TouchableOpacity>
            <Text />
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: "#fff",
    fontSize: 15
  },
  ButtonWrap: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "90%",
    margin: 5
  }
});

export default RegistrationComplete;
