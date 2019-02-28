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
  F: 'Female'
});

var details = t.struct({
  name: t.String,
  surname: t.String,
  email: t.String,
  age: Positive, // refinement
  gender: Gender,
});
class SignupPage extends React.Component {
  // static navigationOptions = {
  //   header: null,
  // };

  //having null header means no back  button is present!

  handleSubmit = () => {
    const value = this._form.getValue();
    this.props.SetProfilePersonalAction(value)
    this.props.navigation.navigate('Registration');
  }

  render(){
    return(
      <View  style={{flex:1}}>

        <LinearGradient
          colors={['#18cdf6', '#43218c']}
          style={{flex:1}}
        >


        <ScrollView>

          <Text style={{top:70}}>
            This is the sign-up page
          </Text>

          <View style={{top:100}}>
          <Form
                  type={details}
                  ref={d => this._form = d}
                />
          </View>

          <View style={{top:250,width:'50%', backgroundColor:'white', right:'-25%'}}>
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

const mapStateToProps = (state) => ({
  ...state
})
const mapDispatchToProps = (dispatch) => ({
  SetProfilePersonalAction: (payload) => dispatch(SetProfilePersonalAction(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);

