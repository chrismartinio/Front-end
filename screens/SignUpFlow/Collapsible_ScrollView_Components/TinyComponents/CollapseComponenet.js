import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

import CreateAccount from "../CreateAccount";
import AboutYou from "../AboutYou";
import Preferences from "../Preferences";
import Interests from "../Interests";
import WouldYouRather from "../WouldYouRather";
import LocalDestinations from "../LocalDestinations";

export default function CollapseComponenet(props) {
  const componentSwitch = componentName => {
    switch (componentName) {
      case "createAccount":
        return <CreateAccount handlePassed={props.handlePassed} />;

      case "aboutYou":
        return <AboutYou handlePassed={props.handlePassed} />;

      case "preferences":
        return (
          <Preferences
            handlePassed={props.handlePassed}
            currentScreenTopY={props.currentScreenTopY}
            preferencesPositionY={props.preferencesPositionY}
          />
        );

      case "interests":
        return (
          <Interests
            handlePassed={props.handlePassed}
            currentScreenTopY={props.currentScreenTopY}
            interestsPositionY={props.interestsPositionY}
          />
        );

      case "wouldYouRather":
        return <WouldYouRather handlePassed={props.handlePassed} />;

      case "localDestinations":
        return (
          <LocalDestinations
            handlePassed={props.handlePassed}
            currentScreenTopY={props.currentScreenTopY}
            localDestinationsPositionY={props.localDestinationsPositionY}
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

      case "localDestinations":
        return "Local destinations";

      default:
        return;
    }
  };

  return (
    <View>
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
          <Text style={{ color: "white", fontSize: 24 }}>
            {componentNameSwitch(props.componentName)}
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            {props.componentPassed ? (
              props.componentName === "createAccount" ? (
                <Icon
                  type="font-awesome"
                  name="lock"
                  color="#fff"
                  iconStyle={{ bottom: 23 }}
                />
              ) : (
                <Icon
                  type="font-awesome"
                  name="check-circle"
                  color="#fff"
                  iconStyle={{ bottom: 23 }}
                />
              )
            ) : (
              <Chevron
                size={2}
                rotate={props.componentToggle ? 0 : 270}
                style={{ bottom: 15, right: 5 }}
                color="#fff"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/*Collapse Body*/}
      <View
        style={{
          display: props.componentToggle ? "block" : "none"
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
