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

import { connect } from "react-redux";

import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

import NextButton from "../../Profile_SharedComponents/NextButton";

import ImageProcessingScreen from "../../../ImageProcessingFlow/app";
import ImgProcessing from "../../../ImageProcessingFlow/mediaHandling/ImageProcessing.js";

import { StackActions, NavigationActions } from "react-navigation";

class SelfieScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploaded: false
    };
  }

  handleisUploaded = () => {
    this.setState({
      isUploaded: true
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.isUploaded !== prevState.isUploaded) {
      if (this.state.isUploaded) {
        this.gotoNextScreen();
      }
    }
  }

  gotoNextScreen = () => {
    if (this.isEdit) {
      //Edit
      const resetProfileAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: "Home" }),
          NavigationActions.navigate({
            routeName: "Profile",
            params: {
              guid: this.props.CreateProfileDataReducer.guid,
              isDeviceUser: true
            }
          })
        ]
      });
      let { navigation } = this.props;
      setTimeout(function() {
        navigation.dispatch(resetProfileAction);
      }, 1000);
    } else {
      //Registration
      return this.props.navigation.navigate("RegistrationComplete");
    }
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.isEdit = navigation.getParam("isEdit");
  }

  render() {
    return <ImageProcessingScreen handleisUploaded={this.handleisUploaded} />;
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

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelfieScreen);
