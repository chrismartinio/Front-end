import MatchHeader from './components/Head';
import InfoText from './components/Info';
import React, { Component } from 'react';
import {Animated ,ScrollView, Text, StyleSheet, View, Dimensions, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo';
import { ProfilePicture } from '../../components/SignUpFlow/ProfilePicture'
import TimerMixin from 'react-timer-mixin';
import CircularTimer from './components/circleTimer'



class InitialMatch extends Component{
    static navigationOptions = {
      header: null,
    };

    constructor(props){
      super(props)
      this.state = {
        currentTime:100,
        blurRadius: 10,
        intervalId:null,
      }
    }

    componentDidMount = () => {
      const id = setInterval(this.handleTimer, 1000)
      this.setState({
        intervalId:id
      })
    }


    handleTimer = () => {

      let timer = this.state.currentTime
      let blurR = this.state.blurRadius

        this.setState({
          currentTime:--timer,
        })

        if(this.state.currentTime === 0){
          clearInterval(this.state.intervalId)
        }


    }

    handleLike = () => {
      // makes db call to see if other person has left the chat
      // ie the other person has ghosted him
        // if so; pop up ghosted screen

        // else still 2 people in room:
        // continue to chat room
        this.props.navigation.navigate('GotLucky');
    }


    handleGhost = () => {
      // send to handle ghost screen
      this.props.navigation.navigate('GhostThem');
    }



  render(){
  var {height, width}= Dimensions.get('window')
  const styles = StyleSheet.create({
  container: {
    width: '100%',
    height:'100%'
  },
    MatchHeader:{
      top:.2 * height,
      left:(1/4) * width,
      width:'50%'
    },
    TextHeader:{
      width:'50%',
      top:(.33 * height),
      left:(1/4) * width
    },
    Picture:{
      top:(.15 * height),
      left:width
    },
    DecisionContainer:{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: 'auto',
      top:(.33 * height),
      left:(1/6) * width
    },
    DecisionText:{
      width: '50%',
      color:'white'
    },
    Icons:{
      width: '50%',
      height:'25%'
    },
   TimerContainer: {
    top:((1/4) * height),
    left:((1/4) * width),
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    },
    timerText: {
      color:'hotpink',
      left: width * .3
    }
  })

    return(
      <LinearGradient
        colors={['#FFFFFF','#18cdf6', '#43218c']}
      >
        <ScrollView style={styles.container}>


          <View style={styles.MatchHeader}>
            <MatchHeader title={'CONGRATS'} text={'You and Taylor must like each other. You have had a 90 second chat'}/>
          </View>

        <View style={styles.TimerContainer}>
          <CircularTimer percent={this.state.currentTime} />
          <Text style={styles.timerText}>
           { this.state.currentTime } sec left
          </Text>
        </View>

          <View style={styles.TextHeader}>
            <InfoText title={'Taylor Swift'} text={'CA, 91741'}/>
          </View>

          <View style={styles.DecisionContainer}>


            <View style={styles.Icons}>
              <TouchableOpacity onPress={this.handleGhost}>
                <Image
                  source={require('../../assets/Assets_V1/Ghost/Little_Ghost/Little_Ghost@1.png')}
                />

                <Text style={styles.DecisionText}>
                  Ghost
                </Text>
              </TouchableOpacity>
            </View>


            <View style={styles.Icons}>
              <TouchableOpacity onPress={this.handleLike}>
                <Image
                  source={require('../../assets/Assets_V1/Like/Like_Heart@1.png')}
                />
                <Text style={styles.DecisionText}>
                  Like
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </LinearGradient>
    )
  }
}

export default InitialMatch;