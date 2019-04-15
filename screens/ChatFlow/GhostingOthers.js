import MatchHeader from './components/Head';
import InfoText from './components/Info'
import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo';
import { ProfilePicture } from '../../components/SignUpFlow/ProfilePicture'



class GhostThem extends Component{

    constructor(props){
      super(props)
    }
    static navigationOptions = {
      header: null,
    };

    backToDecision = () => {
      this.props.navigation.navigate('InitialMatchChoice')
    }



  render(){

  var {height, width}= Dimensions.get('window')


  const styles = StyleSheet.create({
  container: {
    width: '100%',
    height:'100%'
  },
    MatchHeader:{
      top:.33 * width,
      left:(1/4) * width,
      width:'50%'
    },
    TextHeader:{
      width:'50%',
      top:(.33 * width) + 30,
      left:(1/4) * width
    },
    Picture:{
      top:(.33 * width) + 10,
      left:((1/2) * width) - 80,
    },
    DecisionContainer:{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: 'auto',
      top:(.33 * width) + 100,
      left:(1/6) * width
    },
    DecisionText:{
      width: 50,
      height:50,
      color:'white'
    },
    Icons:{
      width: '50%',
      height:'25%'
    },
   TimerContainer: {
    flex: 1,
    justifyContent: 'center'
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    },
    Image: {
      justifyContent: 'space-around'
    }
  })

    return(
      <LinearGradient
        colors={['#FFFFFF','#18cdf6', '#43218c']}
      >
        <ScrollView style={styles.container}>

          <View style={styles.MatchHeader}>
            <MatchHeader title={'WAIT'} text={"You're Ghosting Taylor."}/>
          </View>

          <View style={styles.Picture}>
            <Image
              style={styles.Image}
              height={160}
              width={160}
              borderRadius={80}
              source={require('../../assets/Assets_V1/Ghost/GhostNoRing/Ghosty_No_Ring@1.png')}
            />
          </View>


          <View style={styles.TextHeader}>
            <InfoText title={'ARE YOU SURE?'} text={''}/>
          </View>

          <View style={styles.DecisionContainer}>



            <View style={styles.Icons}>
              <TouchableOpacity onPress={this.backToDecision}>
                <Text style={styles.DecisionText}>
                  NO
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.Icons}>
              <TouchableOpacity onPress={this.handleLeave}>
                <Text style={styles.DecisionText}>
                  YES
                </Text>
              </TouchableOpacity>
            </View>

          </View>



        </ScrollView>
      </LinearGradient>
    )
  }
}

export default GhostThem;