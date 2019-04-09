import MatchHeader from './Header';
import InfoText from './InfoText'
import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo';
import { ProfilePicture } from '../SignUpFlow/ProfilePicture'



class MatchBackground extends Component{
    static navigationOptions = {
      header: null,
    };



  render(){

    var {height, width}= Dimensions.get('window')


  const styles = StyleSheet.create({
  container: {
    width: '100%',
    height:'100%'
  },
    MatchHeader:{
      margin: 'auto',
      top:.33 * width,
      left:.005 * height
    },
    Picture:{
      margin: 'auto',
      top:(.33 * width) + 10,
      left:.20 * height
    }
  })

    return(
      <LinearGradient
        colors={['#FFFFFF','#18cdf6', '#43218c']}
      >
        <ScrollView style={styles.container}>

          <View style={styles.MatchHeader}>
            <MatchHeader title={'WORD'} text={'Hellu my name is world'}/>
          </View>

          <View style={styles.Picture}>
            <ProfilePicture
              height={120}
              width={120}
              radius={60}
            />
          </View>



        </ScrollView>
      </LinearGradient>
    )
  }
}

export default MatchBackground;