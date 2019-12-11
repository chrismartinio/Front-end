import React from "react";
import { Platform, View, Text } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

//Setting Flow
import SettingsScreen from "../screens/SettingsScreen";

//Chat Flow
import HomeScreen from "../screens/HomeScreen";
import MinuteChatRoomScreen from "../screens/ChatFlow/MinuteChatRoomScreen";
import PermanentChatRoomScreen from "../screens/ChatFlow/PermanentChatRoomScreen";

//Match Flow
import MatchingScreen from "../screens/MatchFlow/MatchingScreen";
import MatchScreen from "../screens/MatchFlow/MatchScreen";

//Profile Flow
import ProfileScreen from "../screens/ProfileFlow/Profile/ProfileScreen";
import EditScreen from "../screens/ProfileFlow/Profile/EditScreen";
import ProfileLocationScreen from "../screens/ProfileFlow/Profile/ProfileLocationScreen";
import SelfieScreen from "../screens/ProfileFlow/Profile_Registration/RegistrationScreens/SelfieScreen";

//Notification Components
import NotificationButton from "../sharedComponents/NotificationButton";
import NotificationScreen from "../sharedComponents/NotificationScreen";

//LocationFlow
import LocationServices from "../screens/LocationFlow/LocationServices";

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
    SeflieEdit: {
      screen: SelfieScreen,
      navigationOptions: () => ({
        title: `Edit`
      })
    },
    ProfileLocation: {
      screen: ProfileLocationScreen,
      navigationOptions: () => ({
        title: `Location`
      })
    },

    //Chat Flow
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Home`,
        headerRight: <NotificationButton navigation={navigation} />
      })
    },

    MinuteChatRoom: {
      screen: MinuteChatRoomScreen,
      navigationOptions: () => ({
        title: `Minute`
      })
    },

    PermanentChatRoom: {
      screen: PermanentChatRoomScreen,
      navigationOptions: () => ({
        title: `Permanent`
      })
    },

    LocationServices: {
      screen: LocationServices,
      navigationOptions: () => ({
        title: `Pick a place`
      })
    },

    //Match Flow
    Matching: {
      screen: MatchingScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Matching`,
        headerRight: <NotificationButton navigation={navigation} />
      })
    },
    Match: {
      screen: MatchScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Match`,
        headerRight: <NotificationButton navigation={navigation} />
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
