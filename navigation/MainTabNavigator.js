import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import LoginScreen from "../screens/LoginScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import ProfileScreen from "../screens/ProfileFlow/ProfileScreen";
//import LinksScreen from "../screens/LinksScreen_OnBoarding";

//HOME
const HomeStack = createStackNavigator({
  Home: HomeScreen
});
HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  )
};

//PROFILE
const ProfileStack = createStackNavigator({
  Profile: ProfileScreen
});
ProfileStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

//SETTING
const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
});
SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  )
};

export default createBottomTabNavigator(
  {
    Profile: ProfileStack,
    Home: HomeStack,
    Setting: SettingsStack
  },
  {
    initialRouteName: "Home"
  }
);
//The order of this will determine which screen show first
//change to createStackNavigator if don't want the botTab
