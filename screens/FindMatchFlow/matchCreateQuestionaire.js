import React,{ Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Platform, Picker } from 'react-native';
import t from 'tcomb-form-native';
import Profile from '../ChatFlow/components/circleTimer'

const Form = t.form.Form;
// const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
// stylesheet.textbox.normal.color = '#18cdf6';


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
    flex: 1,
    flexDirection:'row',
    top:10,
    //left:10,
    right: 10
  },
  infoHead: {
    color: '#18cdf6',
    fontSize:30,
    height: 200,
    width:200,
    textAlign: 'right'

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
  },
  Question:{
    color: '#18cdf6'
  },
  buttonInput:{
    color: 'white'
  },
  marginContainer:{
    margin:20,
    height:'100%',


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
                placeholder: 'Your placeholder here',
          }
        }
      }
    }
}


  render(){

    return(
      <View>
        <ImageBackground style={styles.ImageBackground} source={require('../../assets/Assets_V1/Butterfly_Background/butterflyBackground.png')}>

          <View style={styles.marginContainer}>
            <View style={styles.flexContainer}>
              <Profile percent={0}/>

              <Text style={styles.infoHead}>
                hello world blsdfksdfn ksjdbfkjsd kjsdbfkjsdb
              </Text>

            </View>



            <Text style={styles.Question}>
              Question One
            </Text>

            <Form
              type={Questions}
              ref={c => this._form = c}
              options={this.state.options}
            />


            <Text style={styles.Question}>
              Question 2

            </Text>

            <Form
              type={Questions}
              ref={d => this._form = d}
            />


            <Text style={styles.Question}>
            Question 3

            </Text>

            <Form
              type={Questions}
              ref={e => this._form = e}
            />


          <View style={styles.container}>
            <TouchableOpacity>

              <View style={styles.myButton}>
                <Text style={styles.buttonInput}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        </ImageBackground>
      </View>
      )
  }
}

export default CreateQuestionnaire