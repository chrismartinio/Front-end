import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import ProfilePage from './SignUpFlow/ProfilePage'
import MatchesPage from './SignUpFlow/Matches'
import RegistrationPage from './SignUpFlow/RegistrationPage'
import SelfiePage from './SignUpFlow/SelfiePage'
import SignupPage from './SignUpFlow/SignupPage'
import PhotoReview from './SignUpFlow/PhotoReview'
import MatchBackground from '../components/ChatFlow/MatchBackground';
import InitialMatchChoice from './ChatFlow/InitialMatchChoice'
import Selection from './ChatFlow/Selection'
import GhostingOthers from './ChatFlow/GhostingOthers'
import GotGhosted from './ChatFlow/GotGhosted'
import GotLucky from './ChatFlow/GotLuckyGoToChat'
import ChatPage from './ChatFlow/chatMain'

import t from 'tcomb-form-native';
const Form = t.form.Form;


var Component = t.enums({
  sPROFILE: 'SignupFlow/ProfilePage',
  sMATCHES: 'SignupFlow/Matches',
  sChatPage: 'ChatFlow/chatMain',
  sSELFIE: 'SignupFlow/SelfiePage',
sREGISTRATION: 'SignupFlow/RegistrationPage',
  sSIGNUP: 'SignupFlow/SignupPage',
  sPHOTOREVIEW: 'SignupFlow/PhotoReview',
  sCurrTest: 'Current Test Screen',
  sSelection: 'ChatFlow/Selection',
  sGhostingOthers:'ChatFlow/GhostOthers',
  sGotGhosted: 'ChatFlow/GotGhosted',
  sGotLucky: 'ChatFlowGotLucky',
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
      this.props.navigation.navigate('TestProfile');
    } else if(this._form.getValue().Component === 'sMATCHES'){
      this.props.navigation.navigate('TestMatches');
    }else if(this._form.getValue().Component === 'sChatPage'){
      this.props.navigation.navigate('TestChatPage');
    }else if(this._form.getValue().Component === 'sREGISTRATION'){
      this.props.navigation.navigate('TestRegistration');
    }  else if(this._form.getValue().Component === 'sSELFIE'){
      this.props.navigation.navigate('TestSelfie');
    } else if(this._form.getValue().Component === 'sSIGNUP'){
      this.props.navigation.navigate('TestSignUp');
    } else if(this._form.getValue().Component === 'sPHOTOREVIEW'){
      this.props.navigation.navigate('TestPhotoReview');
    }  else if(this._form.getValue().Component === 'sCurrTest'){
      this.props.navigation.navigate('TestScreen');
    } else if(this._form.getValue().Component === 'sSelection'){
      this.props.navigation.navigate('Selection');
    } else if(this._form.getValue().Component === 'sGhostingOthers'){
      this.props.navigation.navigate('GhostingOthers');
    } else if(this._form.getValue().Component === 'sGotGhosted'){
      this.props.navigation.navigate('GotGhosted');
    } else if(this._form.getValue().Component === 'sGotLucky'){
      this.props.navigation.navigate('GotLucky');
    }

  }

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
