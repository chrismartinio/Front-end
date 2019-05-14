import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SignupPage from '../screens/SignUpFlow/SignupPage';
import RegistrationPage from '../screens/SignUpFlow/RegistrationPage';
import SelfiePage from '../screens/SignUpFlow/SelfiePage';
import PhotoReview from '../screens/SignUpFlow/PhotoReview';
import ProfilePage from '../screens/SignUpFlow/ProfilePage';
import ChatPage from '../screens/ChatFlow/chatMain';
import mainSignInPage from '../screens/HomeScreen';
import TestScreen from '../screens/ChatFlow/InitialMatchChoice';
import GhostingOthersScreen from '../screens/ChatFlow/GhostingOthers';
import GotLucky from '../screens/ChatFlow/GotLuckyGoToChat';
import InitialMatchChoice from '../screens/ChatFlow/InitialMatchChoice';
import Selection from '../screens/ChatFlow/Selection';
import GotGhosted from '../screens/ChatFlow/GotGhosted';
import CreateQuestionaire from '../screens/FindMatchFlow/matchCreateQuestionaire';
import ReplyQuestionaire from '../screens/FindMatchFlow/matchCreateReply';
import ViewQuestionaire from '../screens/FindMatchFlow/matchViewReply';


const TestStack = createStackNavigator({
  TestSignUp: SignupPage,
  TestRegistration: RegistrationPage,
  TestSelfie: SelfiePage,
  TestProfile: ProfilePage,
  TestChatPage: ChatPage,
  TestPhotoReview: PhotoReview,
  TestScreen: TestScreen
})


const AuthStack = createStackNavigator({
  SignUp: SignupPage,
  Registration: RegistrationPage,
  Selfie: SelfiePage,
  Profile: ProfilePage
})

const ChatStack = createStackNavigator({
  Chat: ChatPage,
  InitialMatchChoice:InitialMatchChoice,
  GhostingOthers: GhostingOthersScreen,
  GotLucky: GotLucky,
  Selection: Selection,
  GotGhosted: GotGhosted
})

const MatchStack = createStackNavigator({
  CreateQuestionaire: CreateQuestionaire,
  ViewQuestionaire: ViewQuestionaire,
  ReplyQuestionaire: ReplyQuestionaire
})

export default createAppContainer(createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Auth: AuthStack,
    Chat: ChatStack,
    SignIn: mainSignInPage,
    Match: MatchStack,
    Test: TestStack
  }
));