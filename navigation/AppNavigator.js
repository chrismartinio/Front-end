import React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

//Navigator
import MainTabNavigator from "./MainTabNavigator";

//MainScreen
import mainSignInPage from "../screens/HomeScreen";

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
import Collapsible from "../screens/SignUpFlow/ProfileRegistrationClient/CollapsibleRegistration";
import LinksScreen from "../screens/LinksScreen";

const TestStack = createStackNavigator({
  TestLinksScreen: LinksScreen,
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
  TestCollapsible: Collapsible,
  TestRegistrationComplete: RegistrationComplete
});

const AuthStack = createStackNavigator({
  TestLinksScreen: LinksScreen,
  SignUp: Collapsible,
  Registration: RegistrationPage,
  Selfie: SelfiePage,
  Profile: ProfilePage
});

const ChatStack = createStackNavigator({
  TestLinksScreen: LinksScreen, //this TestLinksScreen is to for this stack screen to return to linkscreen
  ChatPage: ChatPage,
  ChatUsersList: ChatUsersList,
  MatchedUserChat: MatchedUserChat,
  InitialMatchChoice: InitialMatchChoice,
  GhostingOthers: GhostingOthersScreen,
  GotLucky: GotLucky,
  Selection: Selection,
  GotGhosted: GotGhosted
});

const MatchStack = createStackNavigator({
  TestLinksScreen: LinksScreen,
  CreateQuestionaire: CreateQuestionaire,
  ViewQuestionaire: ViewQuestionaire,
  ReplyQuestionaire: ReplyQuestionaire
});

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Auth: AuthStack,
    Chat: ChatStack,
    SignIn: mainSignInPage,
    Match: MatchStack,
    Test: TestStack
  })
);
