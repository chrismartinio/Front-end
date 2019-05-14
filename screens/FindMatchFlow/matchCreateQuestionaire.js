import React,{ Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import t from 'tcomb-form-native';
import Profile from '../ChatFlow/components/circleTimer'

const Form = t.form.Form;


var Questions = t.enums({
  M: 'Male',
  F: 'Female'
});
const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
  ImageBackground:{
    height:'100%',
    width:'100%'
  },
  ProfileHeader: {
    flex:1,
    flexDirection:'row',
    borderWidth:1,
    borderRadius:2,
  },
  flexContainer: {

  },
  infoHead: {
    left: (.7) * width,
    top:height *(1/8),
    position: 'absolute'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',


  },
  myButton:{
    padding: 15,
    borderRadius:20,
    backgroundColor:'hotpink',
  }
})


class CreateQuestionnaire extends Component {
  static navigationOptions = {
   //header: null,
   title: 'MATCHES',
   headerStyle: {
     backgroundColor: '#18cdf6',
   },
   headerTintColor: '#fff',
   headerTitleStyle: {
     fontWeight: 'bold',
     fontSize:24
   },
 };
  constructor(props){
    super(props)
       this.state = {
          options: {
            fields: {
              name: {
                placeholder: 'Your placeholder here'
          }
        }
      }
    }
}


  render(){

    return(
      <View>

        <ImageBackground style={styles.ImageBackground} source={require('../../assets/Assets_V1/Butterfly_Background/Butterfly_Background@1.png')}>

              <Text style={styles.infoHead}>
                hello world
              </Text>

              <Profile percent={0}/>


            <Text>
              Question One
            </Text>


            <Form
              type={Questions}
              ref={c => this._form = c}
              options={this.state.options}
            />

            <Text>
              Question 2

            </Text>

            <Form
              type={Questions}
              ref={d => this._form = d}
            />


            <Text>
            Question 3

            </Text>

            <Form
              type={Questions}
              ref={e => this._form = e}
            />


      <View style={styles.container}>
        <TouchableOpacity>

          <View style={styles.myButton}>
            <Text>Rounded Corner</Text>
          </View>
        </TouchableOpacity>
      </View>

        </ImageBackground>
      </View>
      )
  }
}

export default CreateQuestionnaire