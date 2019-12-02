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
import EditScreen from "../screens/ProfileFlow/Profile/EditScreen";
import NotificationButton from "../sharedComponents/NotificationButton";
import NotificationScreen from "../sharedComponents/NotificationScreen";
import MatchingScreen from "../screens/MatchFlow/MatchingScreen";

const MainStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Profile`
        //headerRight is set inside ProfileScreen.js
      })
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Home`,
        headerRight: <NotificationButton navigation={navigation} />
      })
    },
    Setting: {
      screen: SettingsScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Settings`,
        headerRight: <NotificationButton navigation={navigation} />
      })
    },
    Edit: {
      screen: EditScreen,
      navigationOptions: () => ({
        title: `Edit`
      })
    },
    Matching: {
      screen: MatchingScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Matching`,
        headerRight: <NotificationButton navigation={navigation} />
      })
    }
  },
  {
    initialRouteName: "Home",
    mode: "card"
  }
);

export default createStackNavigator(
  {
    Main: {
      screen: MainStack,
      navigationOptions: () => ({
        header: null
      })
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    headerMode: "none",
    mode: "modal",
    transparentCard: true,
    cardStyle: { opacity: 1 }
  }
);
//The order of this will determine which screen show first
//change to createStackNavigator if don't want the botTab
