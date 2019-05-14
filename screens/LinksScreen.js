import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import ProfilePage from './SignUpFlow/ProfilePage'
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
import createQuestionnaire from './FindMatchFlow/matchCreateQuestionaire'
import createReply from './FindMatchFlow/matchCreateReply'
import ViewReply from './FindMatchFlow/matchViewReply'


import t from 'tcomb-form-native';
const Form = t.form.Form;


var Component = t.enums({
  sPROFILE: 'SignupFlow/ProfilePage',
  sREGISTRATION: 'SignupFlow/RegistrationPage',
  sSELFIE: 'SignupFlow/SelfiePage',
  sSIGNUP: 'SignupFlow/SignupPage',
  sPHOTOREVIEW: 'SignupFlow/PhotoReview',
  sCurrTest: 'Current Test Screen',
  sSelection: 'ChatFlow/Selection',
  sGhostingOthers:'ChatFlow/GhostOthers',
  sGotGhosted: 'ChatFlow/GotGhosted',
  sGotLucky: 'ChatFlowGotLucky',
  sCreateQuestionaire:'MatchFlow/CreateQuestionaire',
  sCreateReply: 'MatchFlow/ReplyQuestionaire',
  sViewReply:'MatchFlow/ViewQuestionnaire'
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
    } else if(this._form.getValue().Component === 'sREGISTRATION'){
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
    } else if(this._form.getValue().Component === 'sCreateQuestionaire'){
      this.props.navigation.navigate('CreateQuestionaire');
    } else if(this._form.getValue().Component === 'sCreateReply'){
      this.props.navigation.navigate('ReplyQuestionaire');
    } else if(this._form.getValue().Component === 'sViewReply'){
      this.props.navigation.navigate('ViewQuestionaire');
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
