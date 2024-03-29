import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Picker,
  TextInput,
  Dimensions
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient'

// import Categories from '../../components/SignUpFlow/Categories'
import t from "tcomb-form-native";
import { connect } from "react-redux";
//import SetInterestedDataAction from "../../../../storage/actions/SetInterestedDataAction";
import firebase from "../../../../utils/mainFire";
import Slider from "../CSlider";
import { Math } from "core-js";
import MultiSlider from '@ptomasroos/react-native-multi-slider'

let pickedMen = false;
let pickedWomen = false;

let bkgMen = "transparent";
let bkgWomen = "transparent";

class SignupPage extends React.Component {
  static navigationOptions = {
    //header: null,
    //title: 'Match Chat',
    headerStyle: {
      backgroundColor: "#18cdf6"
    },
    footerStyle: {
      backgroundColor: "#fff"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 24
    }
  };

  //having null header means no back  button is present!
  constructor(props) {
    super(props);
    this.state = {
      pickedMen: "transparent",
      pickedWomen: "transparent",
      ageRange: 18,
      distanceRange: 0,
      sliderOneChanging: false,
        sliderOneValue: [5],
        multiSliderValue: [20, 108],
        nonCollidingMultiSliderValue: [0, 100]
    };
  }
  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };
  handleListener = arg => {
    //console.log(arg)
  };
  setAgeRange = arg => {
    this.setState({
      ageRange: arg
    });
    //console.log(this.state.ageRange)
  };
  setDistanceRange = arg => {
    this.setState({
      distanceRange: arg
    });
    //console.log(this.state.distanceRange)
  };
  pickedMen = () => {
    pickedMen = !pickedMen;
    if (pickedMen === true) this.setState({ pickedMen: "green" });
    else this.setState({ pickedMen: "transparent" });
  };
  pickedWomen = () => {
    pickedWomen = !pickedWomen;
    if (pickedWomen === true) this.setState({ pickedWomen: "green" });
    else this.setState({ pickedWomen: "transparent" });
  };

  handleSubmit = () => {
    let interestedGender = null;
    if (pickedWomen && pickedMen) {
      interestedGender = "both";
    } else if (pickedMen) {
      interestedGender = "men";
    } else if (pickedWomen){
      interestedGender = "female";
    } else {
      interestedGender = "neither"
    }

    this.props.SetInterestedDataAction({
      ageRange: this.state.ageRange,
      distanceRange: this.state.distanceRange,
      interestedGender: interestedGender
    });

    console.log("Passed")
    this.props.navigation.navigate("TestWouldRather");

    return;
  };
  multiSliderValuesChange = values => {
    this.setState({
        multiSliderValue: values,
    },()=>{//console.log(this.state.multiSliderValue[0])
      //console.log("JJJJ "+ this.state.multiSliderValue[1])
    });



};
  render() {
    if (pickedMen == true) bkgMen = "green";
    else bkgMen = "transparent";
    //console.log(this.state);
    return (
      <View style={styles.container}>
        <LinearGradient
          textStyle={{ color: "#fff" }}
          colors={["#18cdf6", "#43218c"]}
          style={{ flex: 1 }}
        >
          <ScrollView>
            <Text style={styles.titleText}>I'm interested in...</Text>
            <View alignItems="center">
              <Text style={styles.text}>Pick one or both</Text>
            </View>
            <View
              style={{ margin: 10, color: "#fff", width: "80%", left: "10%" }}
            >
              <View alignItems="center">
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 40,
                    borderWidth: 2,
                    borderColor: "#fff",
                    width: "55%",
                    backgroundColor: this.state.pickedMen
                  }}
                  onPress={this.pickedMen}
                >
                  <Text style={styles.button}>Men</Text>
                </TouchableOpacity>
              </View>
              <View alignItems="center" top={25}>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 40,
                    borderWidth: 2,
                    borderColor: "#fff",
                    width: "55%",
                    backgroundColor: this.state.pickedWomen
                  }}
                  onPress={this.pickedWomen}
                >
                  <Text style={styles.button}>Women</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.titleText2}>Set your preferences</Text>
              <Text style={styles.textTop}>Preferred age range</Text>

              <View style={styles.slider1}>
              <View style={styles.flexContainer}>
                        <Text style={styles.text2}> {this.state.multiSliderValue[0]}  </Text>
                        <Text style={styles.text2}> {this.state.multiSliderValue[1]}  </Text>
                      </View>
              <MultiSlider
                  values={[
                            this.state.multiSliderValue[0],
                            this.state.multiSliderValue[1],
                        ]}
                  sliderLength={320}
                  onValuesChange={this.multiSliderValuesChange}
                  min={18}
                  max={110}
                  step={1}
                  allowOverlap
                  snapped
                  trackStyle={{
                    //height: 10,
                    shadowColor: 'red',
                }}

                        />

                {/* <Slider
                  functionListener={this.setAgeRange}
                  minimumValue={18}
                  maximumValue={110}
                  leftBound={"18"}
                  rightBound={"110"}
                /> */}
              </View>
              <Text style={styles.textTop2}>
                Preferred match radius (miles)
              </Text>

              <View style={styles.slider2}>
                <Slider
                  functionListener={this.setDistanceRange}
                  minimumValue={0}
                  maximumValue={110}
                  leftBound={"0"}
                  rightBound={"110"}
                />
              </View>

              <View alignItems="center" top={100}>
                <TouchableOpacity
                  style={styles.button2}
                  onPress={this.handleSubmit}
                >
                  <Text style={styles.button}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ///backgroundColor: '#fff',
  },
  titleText: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  text2:{
    color:'white',
  },
  titleText2:{
    margin:10,
    color: '#fff',
    fontSize:24,
    top:25,
    textAlign:"center",
  },
  _textInput: {
    color: "#fff",
    fontSize: 20,
    textAlign: "left",
    paddingTop: "20%",
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  smallText: {
    margin: 10,
    color: "#fff",
    fontSize: 10
  },
  text: {
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  textTop: {
    top: 40,
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  textTop2: {
    top: 60,
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  button: {
    color: "#fff",
    fontSize: 20
  },
  button2: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  buttonMen: {
    alignItems: "center",
    // backgroundColor: bkgMen,
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  flexContainer: {

    //top: height *.45,
    flexDirection: 'row',
    justifyContent:'space-between',
    //position:'absolute',
    alignItems:'stretch',


  },
  buttonWomen: {
    alignItems: "center",
    backgroundColor: bkgWomen,
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  slider1: {
    top: 60
  },
  slider2: {
    top: 80
  },
  slider3: {
    top: 15
  }
});
const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  SetInterestedDataAction: payload => dispatch(SetInterestedDataAction(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupPage);
