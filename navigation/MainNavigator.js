import React from "react";
import { Platform, View, Text } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

//Setting Flow
import SettingsScreen from "../screens/SettingsScreen";

//Match and Chat Flow
import HomeScreen from "../screens/HomeScreen";
import MatchingScreen from "../screens/MatchFlow/MatchingScreen";
import ChatRoomScreen from "../screens/ChatFlow/ChatRoomScreen";

//Profile Flow
import ProfileScreen from "../screens/ProfileFlow/Profile/ProfileScreen";
import EditScreen from "../screens/ProfileFlow/Profile/EditScreen";

//Notification Components
import NotificationButton from "../sharedComponents/NotificationButton";
import NotificationScreen from "../sharedComponents/NotificationScreen";

const MainStack = createStackNavigator(
  {
    //Profile Flow
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Profile`
        //headerRight is set inside ProfileScreen.js
      })
    },
    Edit: {
      screen: EditScreen,
      navigationOptions: () => ({
        title: `Edit`
      })
    },

    //Match and Chat Flow
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Home`,
        headerRight: <NotificationButton navigation={navigation} />
      })
    },

    Matching: {
      screen: MatchingScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Matching`,
        headerRight: <NotificationButton navigation={navigation} />
      })
    },

    ChatRoom: {
      screen: ChatRoomScreen,
      navigationOptions: () => ({
        title: `ChatRoom`
      })
    },

    //Setting Flow
    Setting: {
      screen: SettingsScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Settings`,
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
