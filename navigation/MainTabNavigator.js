import React from "react";
import { Platform, View, Text } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import LoginScreen from "../screens/LoginScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import ProfileScreen from "../screens/ProfileFlow/Profile/ProfileScreen";

//import LinksScreen from "../screens/LinksScreen_OnBoarding";

export default createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
      navigationOptions: () => ({
        title: `Profile`
      })
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        title: `Home`
      })
    },
    Setting: {
      screen: SettingsScreen,
      navigationOptions: () => ({
        title: `Settings`
      })
    },
    Edit: {
      screen: SettingsScreen,
      navigationOptions: () => ({
        title: `Edit`
      })
    },
    Match: {
      screen: SettingsScreen,
      navigationOptions: () => ({
        title: `Match`
      })
    }
  },
  {
    initialRouteName: "Home"
  }
);
//The order of this will determine which screen show first
//change to createStackNavigator if don't want the botTab
