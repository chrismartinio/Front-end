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
import MatchesPage from "../screens/OldScreens/SignUpFlow/Matches";
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
import MatchScreen from "../screens/MatchFlow/MatchScreen";
import MatchingScreen from "../screens/MatchFlow/MatchingScreen";

//LocationFlow
import LocationServices from "../screens/LocationServices/LocationServices";

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
import NotificationButton from "../sharedComponents/NotificationButton";
import NotificationScreen from "../sharedComponents/NotificationScreen";

//Test Matched User Profile Stack
const LinkProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      title: `Profile`
      //headerRight is set inside ProfileScreen.js
    })
  },
  ProfileLocation: {
    screen: ProfileLocationScreen,
    navigationOptions: () => ({
      title: `Location`
    })
  },
  Notification: {
    screen: NotificationScreen,
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
    TestMatches: MatchesPage,

    //Old Sign Up flow
    TestSignUp: SignupPage,
    TestRegistration: RegistrationPage,
    TestOldSelfie: SelfiePage,
    TestAboutYou: AboutYou,
    TestTellUsMore: TellUsMore,
    TestWouldRather: WouldRather,
    TestSpendWeekend: SpendWeekend,
    TestImInterestedIn: ImInterestedIn,

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
    TestRegistrationComplete: RegistrationComplete
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

//Chat Flow
const ChatStack = createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: () => ({
      title: `Home`,
      header: null
    })
  },
  MinuteChatRoom: {
    screen: MinuteChatRoomScreen,
    navigationOptions: () => ({
      title: `MinuteChatRoom`
    })
  },
  PermanentChatRoom: {
    screen: PermanentChatRoomScreen,
    navigationOptions: () => ({
      title: `PermanentChatRoom`
    })
  }
});

//Match Flow
const MatchStack = createStackNavigator({
  Matching: {
    screen: MatchingScreen,
    navigationOptions: () => ({
      title: `MatchLoading`
    })
  },
  Match: {
    screen: MatchScreen,
    navigationOptions: () => ({
      title: `Match`
    })
  }
});

//purpose of putting stacks inside createSwitchNavigator
//because in order to navigate to some screens
//need to put the screen inside createStackNavigator
//then need to put the stack inside createSwitchNavigator
//in order for "navigation" to navigate to that screen
//that begin said, don't put stack inside createSwitchNavigator
//that stack's screens cannot be navigate

//putting screen/stack in Switch doesn't have back button
//if you want to have back button
//navigate the screen/ that stack name
export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Login: LoginScreen, //Login
      Main: MainNavigator, //Profile Home Settings
      SignUp: SignUpStack, //Stacks for LoginScreen <-> SignUp
      Chat: ChatStack, //Stacks for Homescreen <-> ChatRoom
      Test: TestStack, //Stacks for LinksScreen <-> test screens
      Match: MatchStack
    },
    {
      initialRouteName: "Login"
    }
  )
);
