import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';




class MatchHeader extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const styles = StyleSheet.create({
      Title: {
        color: 'pink',
        fontWeight: 'bold',
        margin: 'auto',
        textAlign: 'center'
      },
      Text: {
        color: 'pink',
        margin: 'auto',
        textAlign: 'center'
      },
      Container: {
        flex: 1,
        margin: 'auto'
      }
    })

    return (
      <View style={styles.Container}>
        <Text style={styles.Title}>
          {
            this.props.title
          }
        </Text>
        <Text style={styles.Text}>
          {
            this.props.text
          }
        </Text>
      </View>
    )
  }
}


export default MatchHeader;
