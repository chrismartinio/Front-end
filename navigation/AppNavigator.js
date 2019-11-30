import React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

//Main Navigator
//Profile Home Settings
import MainTabNavigator from "./MainTabNavigator";

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
import CreateQuestionaire from "../screens/FindMatchFlow/matchCreateQuestionaire";
import ReplyQuestionaire from "../screens/FindMatchFlow/matchCreateReply";
import ViewQuestionaire from "../screens/FindMatchFlow/matchViewReply";
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

import ChatUsersList from "../screens/ChatFlow/ChatUsersList";
import MatchedUserChat from "../screens/ChatFlow/MatchedUserChat";

//Profile Flow - Profile_Registration
import ProfileScreen from "../screens/ProfileFlow/Profile/ProfileScreen";
import Profile_Registration from "../screens/ProfileFlow/Profile_Registration/Profile_Registration";
import RegistrationComplete from "../screens/ProfileFlow/Profile_Registration/RegistrationScreens/RegistrationComplete";

//LinkScreen
import LinksScreen from "../screens/LinksScreen";
import LoginScreen from "../screens/LoginScreen";

//register screens here for testing in linkscreen
const TestStack = createStackNavigator({
  Links: LinksScreen,
  TestLocationServices: LocationServices,
  TestQuestionaries: CreateQuestionaire,
  TestSignUp: SignupPage,
  TestRegistration: RegistrationPage,
  TestSelfie: SelfiePage,
  TestProfileScreen: ProfileScreen,
  TestChatPage: ChatPage,
  TestChat: Chat,
  TestPhotoReview: PhotoReview,
  TestScreen: TestScreen,
  TestMatches: MatchesPage,
  TestAboutYou: AboutYou,
  TestTellUsMore: TellUsMore,
  TestWouldRather: WouldRather,
  TestSpendWeekend: SpendWeekend,
  TestImInterestedIn: ImInterestedIn,
  TestProfile_Registration: Profile_Registration,
  TestRegistrationComplete: RegistrationComplete,
  TestChatUsersList: ChatUsersList,
  TestMatchedUserChat: MatchedUserChat
});

//Sign Up
const AuthStack = createStackNavigator({
  Login: LoginScreen, //Default Screen
  SignUp: Profile_Registration
  //Registration: RegistrationPage,
  //Selfie: SelfiePage,
  //Profile: ProfilePage
});

//ChatRoom
const ChatStack = createStackNavigator({
  Main: {
    screen: MainTabNavigator,
    navigationOptions: () => ({
      title: `Home`,
      header: null,
    })
  },
  MatchedUserChat: {
    screen: MatchedUserChat,
    navigationOptions: () => ({
      title: `ChatRoom`
    })
  }

  //ChatPage: ChatPage,
  //InitialMatchChoice: InitialMatchChoice,
  //GhostingOthers: GhostingOthersScreen,
  //GotLucky: GotLucky,
  //Selection: Selection,
  //GotGhosted: GotGhosted
});

/*
const MatchStack = createStackNavigator({
  Links: LinksScreen,
  CreateQuestionaire: CreateQuestionaire,
  ViewQuestionaire: ViewQuestionaire,
  ReplyQuestionaire: ReplyQuestionaire
});
*/

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
      Main: MainTabNavigator, //Profile Home Settings
      Auth: AuthStack, //Stacks for LoginScreen <-> SignUp
      Chat: ChatStack, //Stacks for Homescreen <-> ChatRoom
      Test: TestStack //Stacks for LinksScreen <-> test screens
      //Match: MatchStack,
    },
    {
      initialRouteName: "Login"
    }
  )
);
