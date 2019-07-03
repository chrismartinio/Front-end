import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Picker,
  TextInput,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';
// import Categories from '../../components/SignUpFlow/Categories'
import t from 'tcomb-form-native';
import { connect } from 'react-redux'
import SetProfilePersonalAction from '../../storage/actions/SetProfilePersonalAction'
import firebase from '../../utils/mainFire'
import Slider from './CSlider'
import Collapsible from 'react-native-collapsible';
import SignupPage from './SignupPageC';
import AboutYou from './AboutYou';
import ImInterestedIn from './ImInterestedIn';
import TellUsMore from './TellUsMore';
import WouldRather from './WouldRather';
import SpendWeekend from './SpendAWeekend';



class OnBoarding extends React.Component {
  static navigationOptions = {
    //header: null,
    title: 'Welcome!',
    headerStyle: {
      backgroundColor: '#18cdf6',
    },
    footerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize:24
    },
  };

  //having null header means no back  button is present!
  constructor(props) {
    super(props);
    this.state = {
     
      isCollapsed:true,
      aboutYouCollapsed:true,
      imInterestedInCollapsed:true,
      tellUsMoreCollapsed:true,
      iWouldRatherCollapsed:true,
      spendWeekendCollapsed:true,
      flexSetting:"flex-start"
    };
  }
  collapseSignUp = () => {
    if(this.state.isCollapsed===true)
    {
      this.setState({
        isCollapsed:false,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-end"
      })

    }
    else {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-start"
      })
    }
  };
  collapseAboutYou = () => {
    if(this.state.aboutYouCollapsed===true)
    {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:false,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-end"
      })

    }
    else {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-start"
      })
    }
  };

  collapseImInterestedIn = () => {
    if(this.state.imInterestedInCollapsed===true)
    {
      //console.log("collapseImInterestedIn")
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:false,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-end"
      })

    }
    else {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-start"
      })
    }
  };
  
  collapseTellUsMore = () => {
    if(this.state.tellUsMoreCollapsed===true)
    {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:false,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-end"
      })

    }
    else {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-start"
      })
    }
  };


  collapseIWouldRather = () => {
    if(this.state.iWouldRatherCollapsed===true)
    {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:false,
        spendWeekendCollapsed:true,
        flexSetting:"flex-end"
      })

    }
    else {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-start"
      })
    }
  };


  collapseSpendWeekend = () => {
    if(this.state.spendWeekendCollapsed===true)
    {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:false,
        flexSetting:"flex-end"
      })

    }
    else {
      this.setState({
        isCollapsed:true,
        aboutYouCollapsed:true,
        imInterestedInCollapsed:true,
        tellUsMoreCollapsed:true,
        iWouldRatherCollapsed:true,
        spendWeekendCollapsed:true,
        flexSetting:"flex-start"
      })
    }
  };

  render(){
    //console.log(this.state.text)
    return(

      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}>
      <LinearGradient
        textStyle={{ color: '#fff' }}colors={['#18cdf6', '#43218c']}
        style={{flex:1}}>
          <SafeAreaView style={styles.container}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={{padding: 24,
                        flex: 1,
                        justifyContent: "flex-start",
                        top:"2%",
                        bottom:'1%'}}>
                      <View alignItems= 'center' >
                        <TouchableOpacity style={styles.button2}onPress={this.collapseSignUp}>
                          <Text style={styles.button}>Sign Up</Text>
                        </TouchableOpacity>
                      </View>

                    <Collapsible collapsed={this.state.isCollapsed}>
                        <SignupPage/>
                    </Collapsible>



                    <View alignItems= 'center' >
                        <TouchableOpacity style={styles.button2}onPress={this.collapseAboutYou}>
                          <Text style={styles.button}>About You</Text>
                        </TouchableOpacity>
                      </View>

                    <Collapsible collapsed={this.state.aboutYouCollapsed}>
                        <AboutYou/>
                    </Collapsible>


                    <View alignItems= 'center' >
                        <TouchableOpacity style={styles.button2}onPress={this.collapseImInterestedIn}>
                          <Text style={styles.button}>I'm Interested In</Text>
                        </TouchableOpacity>
                      </View>

                    <Collapsible collapsed={this.state.imInterestedInCollapsed}>
                        <ImInterestedIn/>
                    </Collapsible>
                  
                    <View alignItems= 'center' >
                        <TouchableOpacity style={styles.button2}onPress={this.collapseTellUsMore}>
                          <Text style={styles.button}>Tell Us More</Text>
                        </TouchableOpacity>
                      </View>

                    <Collapsible collapsed={this.state.tellUsMoreCollapsed}>
                        <TellUsMore/>
                    </Collapsible>
                  

                    <View alignItems= 'center' >
                        <TouchableOpacity style={styles.button2}onPress={this.collapseIWouldRather}>
                          <Text style={styles.button}>I Would Rather</Text>
                        </TouchableOpacity>
                      </View>

                    <Collapsible collapsed={this.state.iWouldRatherCollapsed}>
                        <WouldRather/>
                    </Collapsible>
                  

                    <View alignItems= 'center' >
                        <TouchableOpacity style={styles.button2}onPress={this.collapseSpendWeekend}>
                          <Text style={styles.button}>Spend A Weekend</Text>
                        </TouchableOpacity>
                      </View>

                    <Collapsible collapsed={this.state.spendWeekendCollapsed}>
                        <SpendWeekend/>
                    </Collapsible>
                  



                  </View>
          
          
          </TouchableWithoutFeedback>
         
                  
          
          
          </SafeAreaView>

          </LinearGradient>
      </KeyboardAvoidingView>
      )
  }

}
const {height, width } = Dimensions.get('window')
let flexSetting= "flex-start";
const styles = StyleSheet.create({
  container: {
      flex: 1,
      top:"2%",
      bottom:'1%'
  },
  inner: {
      padding: 24,
      flex: 1,
      justifyContent: flexSetting,
      top:"2%",
      bottom:'1%'
  },
  header: {
      fontSize: 36,
      marginBottom: 48,
  },
  input: {
      height: 40,
      borderColor: "#000000",
      borderBottomWidth: 1,
      marginBottom: 36,
  },
  btnContainer: {
      backgroundColor: "white",
      marginTop: 12,
  },
  button:{
    color: '#fff',
    fontSize:20
  },
  _textInput:{
    color: '#fff',
    fontSize: 20,
    textAlign: 'left',
    paddingTop: '20%',
    borderBottomWidth: 1,
    borderColor: '#fff',
},
smallText:{
  margin:10,
  color: '#fff',
  fontSize:10
},
titleText:{
  margin:10,
  color: '#fff',
  fontSize:48,
  textAlign:"center",
  fontWeight:"100"
},
button2: {
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.2)',
  padding: 10,
  //borderRadius: 40,
  borderWidth: 2,
  borderColor: '#fff',
  width:'110%'
},
backgroundImage: {
  height: '100%',
  width: '100%',
  flex: 1,
}
});

export default OnBoarding;
//export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);

