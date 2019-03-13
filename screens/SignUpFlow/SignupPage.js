import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import { LinearGradient } from 'expo';
// import Categories from '../../components/SignUpFlow/Categories'
const Form = t.form.Form;
import t from 'tcomb-form-native';
import { connect } from 'react-redux'
import SetProfilePersonalAction from '../../storage/actions/SetProfilePersonalAction'

var Positive = t.refinement(t.Number, function (n) {
  return n >= 18;
});

var Gender = t.enums({
  M: 'Male',
  F: 'Female',
  T: 'Trans/CIS',
  U: 'Unidentified'
},'Gender');

var details = t.struct({
  name: t.String,
  email: t.String,
  password: t.String,
  age: Positive, // refinement
  gender: Gender
});
class SignupPage extends React.Component {
  // static navigationOptions = {
  //   header: null,
  // };

  //having null header means no back  button is present!

  handleSubmit = () => {
    const value = this._form.getValue();


    const nullCheck = (value) => {
        if(value !== null){
          return true
        }
      return false
    }

    const emailCheck = (email) =>{

      // email validty check?
      const checkAT = email.indexOf('@')
      const checkCOM = email.indexOf('.com')
        if(checkAT > 0 && checkCOM > 0 && email.length > 4){
          return true
        }
      alert("Please Properly insert a email with a '@' & a '.com'")
      return false
    }

    const passwordCheck = (password) => {
      if(password.length > 6 ){
        return true
      }

      return false
    }

    if(nullCheck(value) && emailCheck(value.email) && passwordCheck(value.password)){
      for(let key in value){
        value[key] = JSON.stringify(value[key])
      }
      this.props.SetProfilePersonalAction(value)
      this.props.navigation.navigate('Registration');
    }
  }

  render(){
    return(
      <View  textStyle={{ color: '#fff' }}style={{flex:1}}pickerContainer={{margin:100}}>

        <LinearGradient
          textStyle={{ color: '#fff' }}colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >


        <ScrollView >

          <Text textStyle={{ color: '#fff' }}style={{margin:10}}>
            Passwords must be greater than 6 characters
            emails must include a '@' & '.com'
          </Text>

          <View textStyle={{ color: '#fff' }}style={{margin:10}}>
          <Form
                  style={{color:'black'}}
                  type={details}
                  ref={d => this._form = d}
                />
          </View>

          <View textStyle={{ color: '#fff' }}style={{width:'50%', backgroundColor:'white', right:'-25%',color:'black'}}>
            <Button
              onPress={this.handleSubmit}
              title='Continue'
              color='blue'
            />
          </View>


        </ScrollView>


        </LinearGradient>
      </View>
      )
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  welcomeImage: {
    width: 400,
    height: 250,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  }
});
const mapStateToProps = (state) => ({
  ...state
})
const mapDispatchToProps = (dispatch) => ({
  SetProfilePersonalAction: (payload) => dispatch(SetProfilePersonalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);

