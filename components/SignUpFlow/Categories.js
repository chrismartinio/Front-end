import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ActivityTag } from './ActivityTag';
import { connect } from 'react-redux';

//import SetProfileLikesAction from '../../storage/actions/SetProfileLikesAction'
//import SetProfileFirstLike from '../../storage/actions/SetProfileFirstLike'


class Category extends Component {
  constructor() {
    super();
    this.renderActivityTags = this.renderActivityTags.bind(this);
  }

  handleRedux = (event) => {
    const likes  = this.props.CreateProfileReducer.likes
    // replacing initial state
    if(likes[0] === null){
      return this.props.SetProfileFirstLike(event)
    }
    // blocks duplicates
    for(let i = 0; i < likes.length; i++){
      if(likes[i] === event){
        return
      }
    }
    this.props.SetProfileLikesAction(event)
  }

  renderActivityTags() {
    const listOfTags = ['Malay Food', 'Indo Food', 'American Food', 'Football', 'Soccer', 'Martial Arts', 'Singing', 'Cello', 'Violin','Netflix & Chill', 'Blindly Date', 'Rock Star', 'Cooking','Tech',
    'America'];

    return listOfTags.map((Name, index) => {
      return (
        <View style={{width: '33%', height: 30, marginBottom:10 }} key={`001${index}`}>
            <ActivityTag textContent={Name} key={`xo${index}`} onPress={ (event) => {
              this.handleRedux(Name)
            }}/>
        </View>
        );
    });
  }


  render() {
    return (
        <View style={{ flex:1, flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            this.renderActivityTags()
          }
        </View>
      );
  }
}

const mapStateToProps = state => {
  return {...state}
}

const mapDispatchToProps = dispatch => {
  return {
    SetProfileLikesAction: (payload) => dispatch(SetProfileLikesAction(payload)),
    SetProfileFirstLike: (payload) => dispatch(SetProfileFirstLike(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);
