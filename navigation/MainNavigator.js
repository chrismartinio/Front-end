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
import ConversationsScreen from "../screens/ChatFlow/ConversationsScreen";

//Match Flow
import MatchingScreen from "../screens/MatchFlow/MatchingScreen";
import FoundaMatchScreen from "../screens/MatchFlow/FoundaMatchScreen";

//Profile Flow
import ProfileScreen from "../screens/ProfileFlow/Profile/ProfileScreen";
import EditScreen from "../screens/ProfileFlow/Profile/EditScreen";
import ProfileLocationScreen from "../screens/ProfileFlow/Profile/ProfileLocationScreen";
import SelfieScreen from "../screens/ProfileFlow/Profile_Registration/RegistrationScreens/SelfieScreen";
import ConnectionsScreen from "../screens/ProfileFlow/ConnectionsScreen";

//Custom Components
import NotificationsButton from "../screens/NotificationsFlow/NotificationsButton";
import NotificationsScreen from "../screens/NotificationsFlow/NotificationsScreen";
import CustomBackButton from "../sharedComponents/CustomBackButton";

//LocationFlow
import LocationServices from "../screens/LocationFlow/LocationServices";

const MainStack = createStackNavigator(
  {
    //Home (Landing Screen)
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Blindly`,
        //headerRight: <NotificationsButton navigation={navigation} />,
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          bottom: "3%",
          color: "#660066"
        }
      })
    },

    //Profile Flow
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Profile`,
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          bottom: "3%",
          color: "#660066"
        },
        //headerRight is set inside ProfileScreen.js
        headerLeft: (
          <CustomBackButton buttonColor={"#660066"} navigation={navigation} />
        )
      })
    },
    Edit: {
      screen: EditScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Edit`,
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          bottom: "3%",
          color: "#660066"
        },
        headerLeft: (
          <CustomBackButton buttonColor={"#660066"} navigation={navigation} />
        )
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
    Connections: {
      screen: ConnectionsScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Connections`,
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          bottom: "3%",
          color: "#660066"
        },
        headerLeft: (
          <CustomBackButton buttonColor={"#660066"} navigation={navigation} />
        )
      })
    },

    //Chat Flow
    Conversations: {
      screen: ConversationsScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Blindly`,
        //headerRight: <NotificationsButton navigation={navigation} />,
        //HeaderLeft is set inside ConversationsScreen.js
        headerTitleStyle: {
          bottom: "3%",
          color: "#fff"
        },
        headerStyle: {
          backgroundColor: "#4d88ff",
          borderBottomWidth: 0
        },
        headerLeft: (
          <CustomBackButton buttonColor={"#fff"} navigation={navigation} />
        )
      })
    },

    MinuteChatRoom: {
      screen: MinuteChatRoomScreen,
      navigationOptions: () => ({
        title: `Blindy`,
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          bottom: "3%",
          color: "#660066"
        },
        //gesturesEnabled: false
      })
    },

    PermanentChatRoom: {
      screen: PermanentChatRoomScreen,
      navigationOptions: () => ({
        title: `Blindy`,
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          bottom: "3%",
          color: "#660066"
        }
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
        title: `Matching`
        //headerRight: <NotificationsButton navigation={navigation} />
      })
    },
    FoundaMatch: {
      screen: FoundaMatchScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Found a Match`
        //headerRight: <NotificationsButton navigation={navigation} />
      })
    },

    //Setting Flow
    Setting: {
      screen: SettingsScreen,
      navigationOptions: ({ navigation }) => ({
        title: `Settings`,
        //headerRight: <NotificationsButton navigation={navigation} />
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 0
        },
        headerTitleStyle: {
          bottom: "3%",
          color: "#660066"
        },
        headerLeft: (
          <CustomBackButton buttonColor={"#660066"} navigation={navigation} />
        )
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
    Notifications: {
      screen: NotificationsScreen,
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
