import React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

//Main Navigator
//Profile Home Settings
import MainNavigator from "./MainNavigator";

//Signup flow Screens
import RegistrationPage from "../screens/OldScreens/SignUpFlow/RegistrationPage";
import SelfiePage from "../screens/OldScreens/SignUpFlow/SelfiePage";
import PhotoReview from "../screens/OldScreens/SignUpFlow/PhotoReview";
import ProfilePage from "../screens/OldScreens/SignUpFlow/ProfilePage";
import SignupPage from "../screens/OldScreens/SignUpFlow/IndividualScreensTestingSync/SignupPage";
import AboutYou from "../screens/OldScreens/SignUpFlow/IndividualScreensTestingSync/AboutYou";
import ImInterestedIn from "../screens/OldScreens/SignUpFlow/IndividualScreensTestingSync/ImInterestedIn";
import SpendWeekend from "../screens/OldScreens/SignUpFlow/IndividualScreensTestingSync/SpendAWeekend";
import WouldRather from "../screens/OldScreens/SignUpFlow/IndividualScreensTestingSync/WouldRather";
import TellUsMore from "../screens/OldScreens/SignUpFlow/IndividualScreensTestingSync/TellUsMore";

//Match flow screens
import CreateQuestionaire from "../screens/MatchFlow/matchCreateQuestionaire";
import ReplyQuestionaire from "../screens/MatchFlow/matchCreateReply";
import ViewQuestionaire from "../screens/MatchFlow/matchViewReply";
import FoundaMatchScreen from "../screens/MatchFlow/FoundaMatchScreen";
import MatchingScreen from "../screens/MatchFlow/MatchingScreen";
import Matches from "../screens/OldScreens/SignUpFlow/Matches";

//LocationFlow
import LocationServices from "../screens/LocationFlow/LocationServices";

//Chat Flow screens
import ChatPage from "../screens/ChatFlow/chatMain";
import Chat from "../screens/ChatFlow/Chat";
import TestScreen from "../screens/ChatFlow/InitialMatchChoice";
import GhostingOthersScreen from "../screens/ChatFlow/GhostingOthers";
import GotLucky from "../screens/ChatFlow/GotLuckyGoToChat";
import InitialMatchChoice from "../screens/ChatFlow/InitialMatchChoice";
import Selection from "../screens/ChatFlow/Selection";
import GotGhosted from "../screens/ChatFlow/GotGhosted";
import MinuteChatRoomScreen from "../screens/ChatFlow/MinuteChatRoomScreen";
import PermanentChatRoomScreen from "../screens/ChatFlow/PermanentChatRoomScreen";

//Profile Flow - Profile_Registration
import Profile_Registration from "../screens/ProfileFlow/Profile_Registration/Profile_Registration";
import SelfieScreen from "../screens/ProfileFlow/Profile_Registration/RegistrationScreens/SelfieScreen";
import RegistrationComplete from "../screens/ProfileFlow/Profile_Registration/RegistrationScreens/RegistrationComplete";

//Profile Flow - Profile Screen
import ProfileScreen from "../screens/ProfileFlow/Profile/ProfileScreen";
import EditScreen from "../screens/ProfileFlow/Profile/EditScreen";
import ProfileLocationScreen from "../screens/ProfileFlow/Profile/ProfileLocationScreen";

//LinkScreen
import LinksScreen from "../screens/LinksScreen";
import LoginScreen from "../screens/LoginScreen";

//Notification Components
import NotificationsButton from "../screens/NotificationsFlow/NotificationsButton";
import NotificationsScreen from "../screens/NotificationsFlow/NotificationsScreen";
import ErrorScreen from "../sharedComponents/ErrorScreen";

//Test Matched User Profile Stack
const LinkProfileStack = createStackNavigator({
  LinkProfile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      title: `Profile`
      //headerRight is set inside ProfileScreen.js
    })
  },
  LinkProfileLocation: {
    screen: ProfileLocationScreen,
    navigationOptions: () => ({
      title: `Location`
    })
  },
  LinkNotifications: {
    screen: NotificationsScreen,
    navigationOptions: () => ({
      header: null
    })
  }
});

//register screens here for testing in linkscreen
const TestStack = createStackNavigator(
  {
    Links: LinksScreen,

    //Location
    TestLocationServices: LocationServices,

    //Match Flow
    TestQuestionaries: CreateQuestionaire,
    TestViewQuestionaire: ViewQuestionaire,
    TestReplyQuestionaire: ReplyQuestionaire,
    TestMatches: Matches,

    //Chat flow
    TestChatPage: ChatPage,
    TestChat: Chat,
    TestPhotoReview: PhotoReview,
    TestScreen: TestScreen,

    //Profile Flow
    TestProfile: LinkProfileStack,
    TestProfileLocation: ProfileLocationScreen,

    //Profile Registration Flow
    TestProfile_Registration: Profile_Registration,
    TestSelfie: SelfieScreen,
    TestOldSelfie: SelfiePage,
    TestRegistrationComplete: RegistrationComplete,

    //sharedComponents
    TestErrorScreen: ErrorScreen
  },
  {
    initialRouteName: "Links"
  }
);

//SignUp Flow
const SignUpStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: () => ({
      title: `Login`,
      header: null
    })
  },
  Registration: {
    screen: Profile_Registration,
    navigationOptions: () => ({
      title: `Sign Up`
    })
  },
  Selfie: {
    screen: SelfieScreen,
    navigationOptions: () => ({
      title: `Selfie`,
      header: null
    })
  },
  RegistrationComplete: {
    screen: RegistrationComplete,
    navigationOptions: () => ({
      title: `RegistrationComplete`,
      header: null
    })
  }
});

/*

Switch: no back buttons
Bottom: there is a burger menu tab at the bottom of the screen
Stack: every screens inside the stack can go back by back button

You can export a stacks (the stack's screen must have different name than other stacks's screen)
When you export a stack, this stack will have a default header; you can set the header:null in navigationOptions

Test Main Screen Flow and Login Main Screen Flow (User login),
Both Screens has a footer menu, this footer menu will send a redux guid (always device's user) and a boolean isDeviceUser = true to ProfileScreen
SO Both Flow simulate Device's user go to their Profile screen which will display their profile information

Link Screen Flow
In link screen, the buttons will send a string of guid and a boolean of isDeviceUser = false to Profile Screen
SO Link Screen Flow simulate Device's user go to matched user Profile Screen which will display matched user Profile Screen

Edit Screen would only visible by isDeviceUser = true, and only use the redux guid

*/
export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Login: LoginScreen, //Login
      Main: MainNavigator, //Profile Home Settings
      SignUp: SignUpStack, //Stacks for LoginScreen <-> SignUp
      Test: TestStack //Stacks for LinksScreen <-> test screens
    },
    {
      initialRouteName: "Login"
    }
  )
);
