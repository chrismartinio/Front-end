import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  Picker,
  DatePickerIOS,
  TouchableHighlight,
  SafeAreaView,
  Dimensions,
  ActivityIndicator
} from "react-native";
//Redux
import { connect } from "react-redux";

//Shared Components
import FailScreen from "../../Profile_SharedComponents/FailScreen";
import NextButton from "../../Profile_SharedComponents/NextButton";

//Picker
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");
import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage
} from "../../LocalStorage/localStorage.js";

//Warning Texts
import {
  invalidLikesWarning,
  internalErrorWarning
} from "../Util/RegistrationScreenWarnings.js";

class BackgroundCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passed: false,
      internalErrorWarning: false,
      isSuccess: true
    };
  }

  goToCamera = () => {
    this.props.navigation.navigate("BackgroundCheckImage", {
      handlePassed: this.props.handlePassed
    });
  };

  passScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            padding: "5%"
          }}
        />
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#6a0dad", fontSize: 20 }}>
            You are Passed.
          </Text>
        </View>
      </View>
    );
  };

  defaultScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        {/*Internal Error Warning*/}
        {this.state.internalErrorWarning && internalErrorWarning}

        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
          }}
        />

        {/*I'm interested in Text & Pick one of both Text*/}
        <View style={{ alignItems: "center" }}>
          <Text style={styles.backgroundCheckText}>Background Check</Text>
          <Text />
          <Text />

          <Text style={styles.descriptionText}>
            We want to make sure you're 18 years or older. Please can your photo
            ID.
          </Text>

          {/*Spaces*/}
          <View
            style={{
              padding: "5%"
            }}
          />
        </View>

        {/*Next Button*/}
        <TouchableOpacity style={styles.nextButton} onPress={this.goToCamera}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
          }}
        />
      </View>
    );
  };

  successScreen = () => {
    return this.props.backgroundCheckPassed
      ? this.passScreen()
      : this.defaultScreen();
  };

  failScreen = () => {
    //For isContinueUser Only
    //If fail on fetching, then display a screen to tell them try again
    return <FailScreen />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.failScreen();
  }
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  likeButton: {
    color: "#6a0dad",
    fontSize: 20
  },
  likeButtonWrap: {
    alignItems: "center",
    padding: Math.round(width / 37.5),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#6a0dad",
    width: "auto",
    minWidth: "25%",
    marginLeft: Math.round(width / 125),
    marginRight: Math.round(width / 125),
    marginTop: Math.round(width / 37.5),
    marginBottom: Math.round(width / 37.5)
  },
  backgroundCheckText: {
    color: "#6a0dad",
    fontSize: 20,
    fontWeight: "bold"
  },
  descriptionText: {
    opacity: 0.7,
    color: "#6a0dad",
    fontSize: 18,
    textAlign: "center"
  },
  nextButtonText: {
    color: "#6a0dad",
    fontSize: Math.round(width / 18.75),
    textAlign: "center"
  },
  nextButton: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#6a0dad",
    width: "55%"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackgroundCheck);
