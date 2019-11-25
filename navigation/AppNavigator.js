import React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

//Main Navigator
//Profile Home Settings
import MainTabNavigator from "./MainTabNavigator";

//Other Screens
import MatchesPage from "../screens/SignUpFlow/Matches";
import RegistrationPage from "../screens/SignUpFlow/RegistrationPage";
import SelfiePage from "../screens/SignUpFlow/SelfiePage";
import PhotoReview from "../screens/SignUpFlow/PhotoReview";
import ProfilePage from "../screens/SignUpFlow/ProfilePage";
import ChatPage from "../screens/ChatFlow/chatMain";
import Chat from "../screens/ChatFlow/Chat";
import TestScreen from "../screens/ChatFlow/InitialMatchChoice";
import GhostingOthersScreen from "../screens/ChatFlow/GhostingOthers";
import GotLucky from "../screens/ChatFlow/GotLuckyGoToChat";
import InitialMatchChoice from "../screens/ChatFlow/InitialMatchChoice";
import Selection from "../screens/ChatFlow/Selection";
import GotGhosted from "../screens/ChatFlow/GotGhosted";
import CreateQuestionaire from "../screens/FindMatchFlow/matchCreateQuestionaire";
import ReplyQuestionaire from "../screens/FindMatchFlow/matchCreateReply";
import ViewQuestionaire from "../screens/FindMatchFlow/matchViewReply";
import LocationServices from "../screens/LocationServices/LocationServices";

//On-Boarding Individual Screens
import SignupPage from "../screens/SignUpFlow/IndividualScreensTestingSync/SignupPage";
import AboutYou from "../screens/SignUpFlow/IndividualScreensTestingSync/AboutYou";
import ImInterestedIn from "../screens/SignUpFlow/IndividualScreensTestingSync/ImInterestedIn";
import SpendWeekend from "../screens/SignUpFlow/IndividualScreensTestingSync/SpendAWeekend";
import WouldRather from "../screens/SignUpFlow/IndividualScreensTestingSync/WouldRather";
import TellUsMore from "../screens/SignUpFlow/IndividualScreensTestingSync/TellUsMore";
import RegistrationComplete from "../screens/SignUpFlow/Collapsible_ScrollView_Components/RegistrationComplete.js";

//Chat
import ChatUsersList from "../screens/ChatFlow/ChatUsersList";
import MatchedUserChat from "../screens/ChatFlow/MatchedUserChat";

//On-Boarding Collapsible Screen (Includes all on-boarding screens)
import CollapsibleRegistration from "../screens/SignUpFlow/ProfileRegistrationClient/CollapsibleRegistration";

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
  TestProfile: ProfilePage,
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
  TestCollapsible: CollapsibleRegistration,
  TestRegistrationComplete: RegistrationComplete,
  TestChatUsersList: ChatUsersList,
  TestMatchedUserChat: MatchedUserChat
});

//Sign Up
const AuthStack = createStackNavigator({
  Login: LoginScreen, //Default Screen
  SignUp: CollapsibleRegistration
  //Registration: RegistrationPage,
  //Selfie: SelfiePage,
  //Profile: ProfilePage
});

//ChatRoom
const ChatStack = createStackNavigator({
  Main: MainTabNavigator, //Default screen
  MatchedUserChat: MatchedUserChat
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
