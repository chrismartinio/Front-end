
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

class ProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: [],
      tagSelect: false,
      someState: null,
      likes: ['lol', 'food', 'engineering', 'other stuff', 'loool']
    };
  }

  //https://hackernoon.com/replacing-componentwillreceiveprops-with-getderivedstatefromprops-c3956f7ce607
  // this is for trelling if state changed
  // if state changed then we use component did mount;

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps !== prevState){
      //return new state in object
      return {someState:nextProps}
    }
    else return null
  }

  componentDidUpdate(prevProps, PrevState){
    if(prevProps !== this.props){
      //perfrom some operation here if we are updating:
    alert('we register a change!')

    this.setState({someState: this.props});
    this.classMethod();
    }
  }


  renderTag() {
    switch (this.state.tagSelect) {
      case true:
        return (
        this.state.likes.map((value, key) => (
            <ActivityTag
              onPress={this.handleProfileSubmit}
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
            onPress={this.handleProfileSubmit}
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

  static get



  componentWillMount() {
    axios.get('https://rallycoding.herokuapp.com/api/music_albums')
      .then((res) => {
        this.setState({ profile: res.data });
      })
      .catch((err) => {
        console.log(err);
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
          <ConfirmationButton
            title={'Approve your profile'}
            style={{ borderColor: '#ff1493', color: '#ff1493' }}
          />
        </CardSection>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state
})

export default connect(mapStateToProps)(ProfilePage);