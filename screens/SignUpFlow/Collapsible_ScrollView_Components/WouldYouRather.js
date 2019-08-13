import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo";
import Slider from "./TinyComponents/WouldYouRatherSlider";
import SetWouldRatherDataAction from "../../../storage/actions/SetWouldRatherDataAction";
import { connect } from "react-redux";

class WouldRather extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      passed: true
    };
    this.s1r1 = 50;
    this.s1r2 = 50;
    this.s2r1 = 50;
    this.s2r2 = 50;
    this.s3r1 = 50;
    this.s3r2 = 50;
  }

  handleSubmit = () => {
    //Send data to database
    fetch("http://74.80.250.210:5000/dbRouter/wouldyouRatherSubmit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gui: this.props.CreateProfileReducer.userData.gui,
        s1r1: this.s1r1,
        s1r2: this.s1r2,
        s2r1: this.s2r1,
        s2r2: this.s2r2,
        s3r1: this.s3r1,
        s3r2: this.s3r2
      })
    }).catch(function(error) {
      console.error(error.message);
      throw error;
    });

    //Send Data to Redux
    this.props.SetWouldRatherDataAction({
      s1r1: this.s1r1,
      s1r2: this.s1r2,
      s2r1: this.s2r1,
      s2r2: this.s2r2,
      s3r1: this.s3r1,
      s3r2: this.s3r2
    });
    this.props.handlePassed("wouldYouRather", true);
  };

  handleListener1 = arg => {
    this.s1r1 = 50 - arg;
    this.s1r2 = 50 + arg;
  };

  handleListener2 = arg => {
    this.s2r1 = 50 - arg;
    this.s2r2 = 50 + arg;
  };

  handleListener3 = arg => {
    this.s3r1 = 50 - arg;
    this.s3r2 = 50 + arg;
  };

  render() {
    return (
      <View>
        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
        {/*which do you prefer*/}
        <View style={{ alignItems: "center" }}>
          <Text style={{ opacity: 0.7, color: "white" }}>
            Which do you prefer?
          </Text>
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

        <View style={{ alignItems: "center" }}>
          <View style={{ width: "90%" }}>
            <Slider
              functionListener={this.handleListener1}
              leftBound={"Books"}
              rightBound={"Movie"}
            />
            <Text />
          </View>

          <View style={{ width: "90%" }}>
            <Slider
              functionListener={this.handleListener2}
              leftBound={"Wine"}
              rightBound={"Beer"}
            />
            <Text />
          </View>

          <View style={{ width: "90%" }}>
            <Slider
              functionListener={this.handleListener3}
              leftBound={"Beach"}
              rightBound={"Mountains"}
            />
            <Text />
          </View>
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
  flexSliderContainer: {
    flex: 1
  },
  flexContainer: {
    flex: 1,
    borderColor: "green",
    justifyContent: "center",
    height: height * (1 / 3),
    width: width * (4 / 5),
    borderWidth: 1
  },
  text: {
    color: "white",
    alignItems: "center"
  },
  header: {
    top: height * (1 / 3),
    left: width * (1 / 2)
  },
  parent: {
    flex: 1
  },
  button2: {
    alignItems: "center",
    //backgroundColor: '#fff',
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%",
    zIndex: 1
  },
  buttonStyle: {
    padding: 10,
    alignItems: "center",
    top: height * 0.45
  },
  textView: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  titleText2: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "100"
  },
  viewStyle: {
    top: height * 0.2
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
  }
});

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  SetWouldRatherDataAction: payload =>
    dispatch(SetWouldRatherDataAction(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WouldRather);
