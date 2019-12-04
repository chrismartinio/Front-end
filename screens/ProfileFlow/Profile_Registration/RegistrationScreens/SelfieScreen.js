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

import NextButton from "../../Profile_SharedComponents/NextButton";

class SelfieScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = () => {
    this.props.navigation.navigate("RegistrationComplete");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        >
          <View style={{ alignItems: "center" }}>
            <Text>Selfie Screen</Text>
          </View>
          <NextButton
            passed={true}
            handleSubmit={this.handleSubmit}
            isDelaying={false}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    color: "rgb(67, 33, 140)",
    fontSize: 15
  },
  ButtonWrap: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgb(67, 33, 140)",
    width: "90%",
    margin: 5
  }
});

export default SelfieScreen;