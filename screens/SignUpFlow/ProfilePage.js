import React from 'react';
import {
  View,
  Button,
  ScrollView,
  Text
} from 'react-native';

import { LinearGradient } from 'expo'

export default class ProfilePage extends React.Component {

  handleProfileSubmit = () => {

  }

  render(){
    return (
        <View>

          <ScrollView>

            <Text>
              THis is the profile page:
            </Text>

            <Button
              onPress={this.handleProfileSubmit}
              title='Submit Profile'
            />

          </ScrollView>

        </View>
      )
  }
}