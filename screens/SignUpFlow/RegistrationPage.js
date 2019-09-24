import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import Categories from '../../components/SignUpFlow/Categories'

export default class RegistrationPage extends React.Component {
  // static navigationOptions = {
  //   header: null,
  // };

  //having null header means no back  button is present!

  handleSubmit = () => {
    // to selfie page
    this.props.navigation.navigate('Selfie');
  }

  render(){
    return(
      <View  style={{flex:1}}>

        <LinearGradient
          colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >


        <ScrollView>

          <Text style={{top:70}}>
            This is the registration page
          </Text>

          <View style={{top:100}}>
            <Categories />
          </View>

          <View style={{top:250,width:'50%', backgroundColor:'white', right:'-25%'}}>
            <Button
              onPress={this.handleSubmit}
              title='Submit'
              color='blue'
            />
          </View>


        </ScrollView>


        </LinearGradient>
      </View>
      )
  }

}



