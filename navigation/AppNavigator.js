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
import TestScreen from '../components/ChatFlow/MatchBackground';

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
})

export default createAppContainer(createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Auth: AuthStack,
    Chat: ChatStack,
    SignIn: mainSignInPage,
    Test: TestStack
  }
));