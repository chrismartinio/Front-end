import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform
} from "react-native";

//icons
import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

//CollapsibleScreens
import CreateAccount from "../Profile_Registration/RegistrationScreens/CreateAccount";
import AboutYou from "../Profile_Registration/RegistrationScreens/AboutYou";
import Preferences from "../Profile_Registration/RegistrationScreens/Preferences";
import Interests from "../Profile_Registration/RegistrationScreens/Interests";
import WouldYouRather from "../Profile_Registration/RegistrationScreens/WouldYouRather";
import LocalDestination from "../Profile_Registration/RegistrationScreens/LocalDestination";

//Dimensions
const { height, width } = Dimensions.get("window");

export default function CollapsibleScreenTab(props) {
  const componentSwitch = componentName => {
    switch (componentName) {
      case "createAccount":
        return (
          <CreateAccount
            handlePassed={props.handlePassed}
            handleToggle={props.handleToggle}
            createAccountToggle={props.componentToggle}
          />
        );

      case "aboutYou":
        return (
          <AboutYou
            handlePassed={props.handlePassed}
            aboutYouToggle={props.componentToggle}
          />
        );

      case "preferences":
        return (
          <Preferences
            handlePassed={props.handlePassed}
            preferencesToggle={props.componentToggle}
            otherToggle={props.otherToggle}
            scrollY={props.scrollY}
          />
        );

      case "interests":
        return (
          <Interests
            handlePassed={props.handlePassed}
            interestsToggle={props.componentToggle}
            otherToggle={props.otherToggle}
            scrollY={props.scrollY}
          />
        );

      case "wouldYouRather":
        return (
          <WouldYouRather
            handlePassed={props.handlePassed}
            wouldYouRatherToggle={props.componentToggle}
          />
        );

      case "localDestination":
        return (
          <LocalDestination
            handlePassed={props.handlePassed}
            localDestinationToggle={props.componentToggle}
            otherToggle={props.otherToggle}
            scrollY={props.scrollY}
          />
        );

      default:
        return;
    }
  };

  const componentNameSwitch = componentName => {
    switch (componentName) {
      case "createAccount":
        return "Create account";

      case "aboutYou":
        return "About you";

      case "preferences":
        return "Preferences";

      case "interests":
        return "Interests";

      case "wouldYouRather":
        return "Would you rather";

      case "localDestination":
        return "Local destinations";

      default:
        return;
    }
  };

  const componentStatus = componentStatus => {
    switch (componentStatus) {
      case "passed":
        return (
          <Icon
            type="font-awesome"
            name="check-circle"
            color="#6a0dad"
            iconStyle={{ bottom: 25 }}
          />
        );

      case "empty":
        return (
          <Chevron
            size={2}
            rotate={props.componentToggle ? 0 : 270}
            style={{ bottom: 17, right: 5 }}
            color="#6a0dad"
          />
        );

      case "error":
        return (
          <Icon
            type="font-awesome"
            name="exclamation-circle"
            color="#6a0dad"
            iconStyle={{ bottom: 25 }}
          />
        );

      default:
        return (
          <Chevron
            size={2}
            rotate={props.componentToggle ? 0 : 270}
            style={{ bottom: 15, right: 5 }}
            color="#6a0dad"
          />
        );
    }
  };
  return (
    <View>
      {/*IOS*/}
      {/*Collapse Header*/}
      <View
        style={{
          opacity: props.componentToggle ? 1 : 0.5
        }}
      >
        <TouchableOpacity
          onPress={evt => {
            props.handleToggle(props.componentName, evt);
          }}
        >
          <Text
            style={{
              color: "#6a0dad",
              fontSize: Math.round(width / 17.625),
              fontWeight: "500"
            }}
          >
            {componentNameSwitch(props.componentName)}
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            {componentStatus(props.componentStatus)}
          </View>
        </TouchableOpacity>
      </View>

      {/*Collapse Body*/}
      <View
        style={{
          display: props.componentToggle ? "flex" : "none"
        }}
      >
        {componentSwitch(props.componentName)}
      </View>
      {/*Spaces*/}
      <View
        style={{
          padding: "10%"
        }}
      />
    </View>
  );
}
