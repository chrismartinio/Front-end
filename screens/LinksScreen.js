import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import ProfilePage from './SignUpFlow/ProfilePage'
import RegistrationPage from './SignUpFlow/RegistrationPage'
import SelfiePage from './SignUpFlow/SelfiePage'
import SignupPage from './SignUpFlow/SignupPage'
import t from 'tcomb-form-native';
const Form = t.form.Form;


var Component = t.enums({
  sPROFILE: 'SignupFlow/ProfilePage',
  sREGISTRATION: 'SignupFlow/RegistrationPage',
  sSELFIE: 'SignupFlow/SelfiePage',
  sSIGNUP: 'SignupFlow/SignupPage'
},'Component');

var details = t.struct({
  Component: Component
});

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Testing Screen',
  };
  constructor(props){
    super(props)
    this.state = {
      CurrentScreen: ProfilePage
    }
  }

  handleChange = () => {

    if(this._form.getValue().Component === 'sPROFILE'){
      this.setState({
        CurrentScreen: ProfilePage
      })
    } else if(this._form.getValue().Component === 'sREGISTRATION'){
      this.setState({
        CurrentScreen: RegistrationPage
      })
    }  else if(this._form.getValue().Component === 'sSELFIE'){
      this.setState({
        CurrentScreen: SelfiePage
      })
    } else if(this._form.getValue().Component === 'sSIGNUP'){
      this.setState({
        CurrentScreen: SignupPage
      })
    } else {
      this.setState({
        CurrentScreen: ProfilePage
      })
    }
  }

  // order
  // drop dowwn menu
  // rendered component

  render() {
    let CurrentScreen = this.state.CurrentScreen
    return (
      <ScrollView style={styles.container}>
        <Form
            style={{color:'black'}}
            type={details}
            ref={d => this._form = d}
            onChange={this.handleChange}
        />

        <View>
        <CurrentScreen />
        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
