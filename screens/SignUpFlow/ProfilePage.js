
import React from 'react';
import {
  View,
  Button,
  ScrollView,
  Text
} from 'react-native';
import {
  InfoTextHeader,
  CardSection,
  ProfileSection,
  ProfilePicture,
  ConfirmationButton,
  ActivityTag,
  ProfileContainer
} from '../../components/SignUpFlow/Index'

import { LinearGradient } from 'expo'
import axios from 'axios'
import { connect } from 'react-redux'
import firebase from '../../utils/mainFire'

class ProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: 'https://rallycoding.herokuapp.com/api/music_albums',
      tagSelect: false,
      profileData: null,
      likes: ['lol', 'food', 'engineering', 'other stuff', 'loool']
    };
  }

  //https://hackernoon.com/replacing-componentwillreceiveprops-with-getderivedstatefromprops-c3956f7ce607
  // this is for trelling if state changed
  // if state changed then we use component did mount;

  //howwever we lose all input in child component
  // if parent component changes with every change

  // problem: when we send a dispatch in a parent component
      // we also send another dispatch in the next component screen
      // which causes the input from the parent to be erased in redux for some reason

      //possible fix: sign in during categories: then

  //possible fix is to just only change on specific differences: for example
  // we can only change with email change

  //fix: workaround: only when all details in sign up page are filled out does the data send



  static getDerivedStateFromProps(nextProps, prevState){
    console.log('comparisons!',nextProps, prevState)
    if(nextProps.CreateProfileReducer !== prevState.profileData){
      //return new state in object

      return {profileData:nextProps}
    }
    else return null
  }

  componentDidUpdate(prevProps, PrevState){
    if(prevProps !== this.props){
      //perfrom some operation here if we are updating:

    this.setState({profileData: this.props.CreateProfileReducer});


    this.classMethod();
    }
  }

  startInitialSignUp = (data) => {

    //front end check here
    //console.log('this is the prof data:',this.state.profileData.CreateProfileReducer.data)
    const { email, password } = this.state.profileData.CreateProfileReducer.data

    if(email && password){
      console.log('were running')
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage, errorCode)
        // ...
      });

     }
  }


  renderTag() {
    switch (this.state.tagSelect) {
      case true:
        return (
        this.state.likes.map((value, key) => (
            <ActivityTag
              onPress={this.startInitialSignUp}
              buttonStyle={{
                backgroundColor: '#007aff',
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.7,
              }}
              textStyle={{ color: '#fff' }}
              textContent={value}
              key={`profile1${key}`}
            />
        ))
      );
      default:
        return (

          this.state.likes.map((value, key) => (
          <ActivityTag
            onPress={this.startInitialSignUp}
            textContent={value}
            key={`profile${key}`}
          />
        ))

      );
    }

    return this.state.likes.map((Name, index) => {
      return (
        <View style={{color:'black',width: '33%', height: 30, marginBottom: 10 }} key={`001${index}`}>
            <ActivityTag textContent={Name} key={`pf1${index}`}/>
        </View>
        );
    });
  }


  render(){
    return (
      <ScrollView>
        <ProfileContainer>
          <ProfileSection >
            <ProfilePicture />
            <InfoTextHeader />
          </ProfileSection>

        </ProfileContainer>

        <CardSection>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
            {
              this.renderTag()
            }
          </View>
        </CardSection>


        <CardSection>
          <View>
            <ConfirmationButton
              title={'Approve your profile'}
              style={{ borderColor: '#ff1493', color: '#ff1493' }}
              onPress={this.startInitialSignUp}
            />
          </View>
        </CardSection>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state
})

export default connect(mapStateToProps)(ProfilePage);