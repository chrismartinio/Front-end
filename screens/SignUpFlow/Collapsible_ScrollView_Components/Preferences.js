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
import SetInterestedDataAction from "../../../storage/actions/SetInterestedDataAction";
import firebase from "../../../utils/mainFire";
import Slider from "./TinyComponents/PreferencesSlider";
//import { Math } from "core-js";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Icon } from "react-native-elements";
const screenHeight = Math.round(Dimensions.get("window").height);

class Preferences extends React.Component {
  //having null header means no back  button is present!
  constructor(props) {
    super(props);
    this.state = {
      pickedMen: false,
      pickedWomen: false,
      sliderOneChanging: false,
      sliderOneValue: [5],
      ageRange: [20, 108],
      interestedGenderWarning: "empty",
      passed: false,
      distanceRange: 0
      //distanceWarning: "empty",
    };

    //Control Button Text Color based on Current Screen's Position
    this.bMaley = 0;
    this.bFemaley = 0;

    this.mode = "";
    this.gui = "";
  }

  componentDidMount() {
    this.mode = this.props.CreateProfileReducer.mode;

    //For Undone User
    if (this.mode === "undone") {
      let pickedMen = false;
      let pickedWomen = false;
      let ageRange = this.props.CreateProfileReducer.interestedData.ageRange;
      let distanceRange = this.props.CreateProfileReducer.interestedData
        .distanceRange;
      let interestedGender = this.props.CreateProfileReducer.interestedData
        .interestedGender;

      if (interestedGender === "both") {
        pickedMen = true;
        pickedWomen = true;
      } else if (interestedGender === "male") {
        pickedMen = true;
      } else if (interestedGender === "female") {
        pickedWomen = true;
      } else {
        pickedMen = false;
        pickedWomen = false;
      }

      this.setState({
        pickedMen: pickedMen,
        pickedWomen: pickedWomen,
        interestedGenderWarning:
          pickedMen === "" && pickedWomen === "" ? "empty" : "",
        ageRange: ageRange,
        distanceRange: distanceRange
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)
    if (
      this.state.pickedMen !== prevState.pickedMen ||
      this.state.pickedWomen !== prevState.pickedWomen ||
      this.state.distanceRange !== prevState.distanceRange
    ) {
      this.allChecker();
      //any changes will remove the check mark from CollapsibleComponent CheckMark
      this.props.handlePassed("preferences", false);
    }
  }

  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  //match radius
  setDistanceRange = arg => {
    this.setState({
      distanceRange: arg
    });
  };

  //age range
  ageRangeChange = values => {
    this.setState({
      ageRange: values
    });
  };

  //gender
  pickedGender = gender => {
    this.setState({
      [gender]: !this.state[gender]
    });
  };

  genderChecker = () => {
    if (this.state.pickedMen === true || this.state.pickedWomen === true) {
      return true;
    }
    return false;
  };

  distanceChecker = () => {
    if (this.state.distanceRange > 0) {
      return true;
    }
    return false;
  };

  allChecker = () => {
    //let distance = false;
    let distance = true;
    let gender = false;

    if (!this.genderChecker()) {
      gender = false;
      this.setState(
        {
          interestedGenderWarning: "empty"
        },
        () => {
          return;
        }
      );
    } else {
      gender = true;
      this.setState({
        interestedGenderWarning: ""
      });
    }

    /*
    if (!this.distanceChecker()) {
      distance = false;
      this.setState(
        {
          distanceWarning: "empty"
        },
        () => {
          return;
        }
      );
    } else {
      distance = true;
      this.setState({
        distanceWarning: "empty"
      });
    }
    */

    if (gender && distance) {
      this.setState({
        passed: true
      });
    } else {
      this.setState({
        passed: false
      });
    }
  };

  changeColor = bname => {
    let topY = this.props.scrollY;

    const topRed = 24;
    const topGreen = 205;
    const topBlue = 246;
    const bottomRed = 67;
    const bottomGreen = 33;
    const bottomBlue = 140;

    let pos = (this[bname] - topY) / screenHeight;

    let colorRed = topRed + (bottomRed - topRed) * pos;
    let colorGreen = topGreen + (bottomGreen - topGreen) * pos;
    let colorBlue = topBlue + (bottomBlue - topBlue) * pos;

    return `rgb(${colorRed},${colorGreen},${colorBlue})`;
  };

  handleSubmit = () => {
    if (this.state.passed) {
      let interestedGender = "";
      if (this.state.pickedMen && this.state.pickedWomen) {
        interestedGender = "both";
      } else if (this.state.pickedMen) {
        interestedGender = "male";
      } else if (this.state.pickedWomen) {
        interestedGender = "female";
      } else {
        interestedGender = "";
      }

      //Send data to database
      fetch("http://10.1.10.90:5000/api/profile/preferencesSubmit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gui: this.props.CreateProfileReducer.userData.gui,
          ageRange: this.state.ageRange,
          distanceRange: this.state.distanceRange,
          interestedGender: interestedGender
        })
      }).catch(function(error) {
        console.error(error.message);
        throw error;
      });

      //Send Data to Redux
      this.props.SetInterestedDataAction({
        ageRange: this.state.ageRange,
        distanceRange: this.state.distanceRange,
        interestedGender: interestedGender
      });
      this.props.handlePassed("preferences", true);
    } else {
      this.props.handlePassed("preferences", false);
    }
  };

  render() {
    let emptyGenderWarning = (
      <View style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Icon
            type="font-awesome"
            name="exclamation-circle"
            color="#fff"
            iconStyle={{ top: 3 }}
          />
          <Text style={styles.warningText}>
            {"   "}Please choose at least one gender
          </Text>
        </View>
      </View>
    );

    let distanceWarning = (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Icon
          type="font-awesome"
          name="exclamation-circle"
          color="#fff"
          iconStyle={{ top: 3 }}
        />
        <Text style={styles.warningText}>
          {"   "}Please choose our preferred distance
        </Text>
      </View>
    );

    return (
      <View style={{ flex: 1 }}>
        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
        {/*I'm interested in Text & Pick one of both Text*/}
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 24 }}>
            I'm interested in
          </Text>
          <Text />
          <Text style={{ opacity: 0.7, color: "white" }}>Pick one or both</Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "5%"
              //borderRadius: 4,
              //borderWidth: 0.5,
              //borderColor: "#d6d7da"
            }}
          />
        </View>

        {/*Men and Women buttons */}
        <View
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            this.bMaley = layout.y + this.props.preferencesPositionY;
            this.bFemaley = layout.y + this.props.preferencesPositionY;
          }}
          style={{ alignItems: "center" }}
        >
          {/*Men*/}
          <TouchableOpacity
            style={[
              styles.genderButtonWrap,
              {
                backgroundColor: this.state.pickedMen ? "white" : "transparent"
              }
            ]}
            onPress={() => {
              this.pickedGender("pickedMen");
            }}
          >
            <Text
              style={[
                styles.button,
                {
                  color: this.state.pickedMen
                    ? this.changeColor(`bMaley`)
                    : "white"
                }
              ]}
            >
              Men
            </Text>
          </TouchableOpacity>
          <Text />
          {/*Women*/}
          <TouchableOpacity
            style={[
              styles.genderButtonWrap,
              {
                backgroundColor: this.state.pickedWomen
                  ? "white"
                  : "transparent"
              }
            ]}
            onPress={() => {
              this.pickedGender("pickedWomen");
            }}
          >
            <Text
              style={[
                styles.button,
                {
                  color: this.state.pickedWomen
                    ? this.changeColor(`bFemaley`)
                    : "white"
                }
              ]}
            >
              Women
            </Text>
          </TouchableOpacity>
          <Text />
        </View>
        {this.state.interestedGenderWarning === "empty" && emptyGenderWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "10%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/*Preferred age range*/}
        <View>
          <Text style={styles.textTop}>Preferred age range</Text>
          <View style={styles.flexContainer}>
            <Text style={styles.text2}> {this.state.ageRange[0]} </Text>
            <Text style={styles.text2}> {this.state.ageRange[1]} </Text>
          </View>
          <MultiSlider
            values={[this.state.ageRange[0], this.state.ageRange[1]]}
            sliderLength={320}
            onValuesChange={this.ageRangeChange}
            min={18}
            max={110}
            step={1}
            allowOverlap
            snapped
            trackStyle={{
              shadowColor: "red",
              backgroundColor: "white"
            }}
          />
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "10%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/*Preferred match radius*/}
        <View>
          <Text style={styles.textTop}>Preferred match radius</Text>
          <Slider
            functionListener={this.setDistanceRange}
            minimumValue={0}
            maximumValue={110}
            leftBound={"0"}
            rightBound={"110"}
            value={this.state.distanceRange}
          />
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "10%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />

        {/*Next Button*/}
        <View
          alignItems="center"
          style={{ opacity: this.state.passed ? 1.0 : 0.5 }}
        >
          <TouchableOpacity
            style={styles.nextButton}
            onPress={this.handleSubmit}
            disabled={!this.state.passed}
          >
            <Text style={styles.button}>Next</Text>
          </TouchableOpacity>
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
      </View>
    );
  }
}
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
    ///backgroundColor: '#fff',
  },
  titleText: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  text2: {
    color: "white"
  },
  titleText2: {
    margin: 10,
    color: "#fff",
    fontSize: 24,
    top: 25,
    textAlign: "center"
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
    //top: 40,
    //margin: 10,
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
  flexContainer: {
    //top: height *.45,
    flexDirection: "row",
    justifyContent: "space-between",
    //position:'absolute',
    alignItems: "stretch"
  },
  slider1: {
    top: 60
  },
  slider2: {
    top: 80
  },
  slider3: {
    top: 15
  },
  warningText: {
    color: "#fff",
    fontSize: 10,
    paddingTop: "3%",
    fontWeight: "bold"
  },
  button: {
    color: "#fff",
    fontSize: 20
  },
  nextButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  genderButtonWrap: {
    alignItems: "center",
    padding: 7,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "65%"
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
)(Preferences);
