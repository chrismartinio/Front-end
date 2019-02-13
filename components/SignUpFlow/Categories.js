import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { ActivityTag } from './ActivityTag'


class Category extends Component {
  constructor() {
    super();
    this.renderActivityTags = this.renderActivityTags.bind(this);
  }

  renderActivityTags() {
    const listOfTags = ['Malay Food', 'Indo Food', 'American Food', 'Football', 'Soccer', 'Martial Arts', 'Singing', 'Cello', 'Violin','Netflix & Chill', 'Blindly Date', 'Rock Star', 'Cooking','Tech',
    'America'];

    return listOfTags.map((Name, index) => {
      return (
        <View style={{width: '33%', height: 30, marginBottom:10 }} key={`001${index}`}>
            <ActivityTag textContent={Name} key={`xo${index}`}/>
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

export default Category;