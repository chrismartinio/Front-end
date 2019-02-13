import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import SignupPage from '../screens/SignUpFlow/SignupPage';
import RegistrationPage from '../screens/SignUpFlow/RegistrationPage';
import SelfiePage from '../screens/SignUpFlow/SelfiePage';
import ProfilePage from '../screens/SignUpFlow/ProfilePage';


const AuthStack = createStackNavigator({
  SignUp: SignupPage,
  Registration: RegistrationPage,
  Selfie: SelfiePage,
  Profile: ProfilePage
})

export default createAppContainer(createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    Auth: AuthStack,
  }
));