
import MatchHeader from './components/Head';
import InfoText from './components/Info'
import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, View, Dimensions, TouchableOpacity, Button } from 'react-native';
import { LinearGradient } from 'expo';
import { ProfilePicture } from '../../components/SignUpFlow/ProfilePicture'



class GetLuckyScreen extends Component{
    static navigationOptions = {
      header: null,
    };

    constructor(props){
      super(props)
    }

    handleExit = () => {
      this.props.navigation.navigate('InitialMatchChoice')
    }

    handleChat =()=> {
      this.props.navigation.navigate('Chat')
    }



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
    },
    Exit:{
      margin: 'auto',
      top: .10 * height,
      left: .90 * width
    },
    Text:{
      color:'pink',
    },
    overLayContainer:{
      top: .5 * height,
      left:.25 * width,
      flex:1,
    },
    overLay:{
      width: 100,
      height: 100,
      borderRadius: 85,
      backgroundColor: 'blue',
      borderWidth:2,
      borderColor:'pink',
    }
  })



    return(
      <LinearGradient
        colors={['#FFFFFF','#18cdf6', '#43218c']}
      >
        <ScrollView style={styles.container}>

        <View>
          <TouchableOpacity onPress={this.handleExit} style={styles.Exit}>
            <Text style={{color:'pink'}}>
              X
            </Text>
          </TouchableOpacity>
        </View>

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

          <TouchableOpacity style={styles.overLayContainer} onPress={this.handleChat}>
              <View style={styles.overLay}>
                    <Text style={styles.Text}>
                      Go To Chat
                    </Text>
            </View>
          </TouchableOpacity>




        </ScrollView>
      </LinearGradient>
    )
  }
}

export default GetLuckyScreen;