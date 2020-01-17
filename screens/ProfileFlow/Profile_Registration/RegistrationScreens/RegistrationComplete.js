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
import { LinearGradient } from "expo-linear-gradient";

import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

class RegistrationComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={require("../../../../assets/images/butterfly.png")}
          style={{
            width: 100,
            height: 100
          }}
        />
        <Text />
        <Text style={{ fontSize: 24, color: "#6a0dad" }}>
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
        {/*<View alignItems="center">
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={styles.button}>Back to Login</Text>
          </TouchableOpacity>
          <Text />
        </View>*/}

        {/*Continue Button*/}
        <View alignItems="center">
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("PreSettings");
            }}
          >
            <Text style={styles.button}>Start Matching!</Text>
          </TouchableOpacity>
          <Text />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: "#6a0dad",
    fontSize: 15
  },
  ButtonWrap: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#6a0dad",
    width: "90%",
    margin: 5
  }
});

export default RegistrationComplete;
