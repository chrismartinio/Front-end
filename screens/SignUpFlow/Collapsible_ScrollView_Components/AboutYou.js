import React, { Component } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
//import SetProfilePersonalAction from "../../storage/actions/SetProfilePersonalAction";
import SetProfilePersonalAction from "../../../storage/actions/SetProfilePersonalAction";
//import firebase from "../../utils/mainFire";
import firebase from "../../../utils/mainFire";
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";
//import { countries, genders } from "./someData.js";
import { countries, genders } from "../someData.js";
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

class AboutYou extends Component {
  constructor(props) {
    super(props);
    //this.firstNameInputRef = React.createRef();
    //this.lastNameInputRef = React.createRef();
    //this.genderPickerRef = React.createRef();

    this.state = {
      birthDate: "",
      gender: "",
      country: "",
      firstName: "",
      lastName: "",
      zipCode: "",
      empty: false,
      passed: false,
      firstNameWarning: "empty",
      lastNameWarning: "empty",
      genderWarning: "empty",
      countryWarning: "empty",
      zipCodeWarning: "empty",
      birthDateWarning: "empty"
    };
  }

  render() {
    let passed = <View style={styles.warningText} />;

    let invalidFirstNameLastNameWarning = (
      <Text style={styles.warningText}>
        error: only Accept Letters and Spaces.{" "}
      </Text>
    );
    let invalidBirthDateWarning = (
      <Text style={styles.warningText}>error: You MUST be at least 18!</Text>
    );
    let invalidGenderCountryWarning = (
      <Text style={styles.warningText}>error: field cannot be empty!</Text>
    );
    let invalidZipCodeWarning = (
      <Text style={styles.warningText}>error: Zip code MUST be 5 digits</Text>
    );
    let empty = <Text style={styles.warningText}>error: empty field</Text>;

    let allEmptyWarning =
      this.state.firstNameWarning === "empty" ||
      this.state.lastNameWarning === "empty" ||
      this.state.birthDateWarning === "empty" ||
      this.state.genderWarning === "empty" ||
      this.state.countryWarning === "empty" ||
      this.state.zipCodeWarning === "empty";

    return <View>

    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleText: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  wholeWrap: {
    flex: 1,
    justifyContent: "flex-end",

    marginBottom: "5%",
    marginLeft: "10%",
    marginRight: "10%"
    //borderRadius: 4,
    //borderWidth: 0.5,
    //borderColor: "#d6d7da"
  },

  button: {
    alignItems: "center",
    //backgroundColor: '#fff',
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "70%"
  },
  passedButton: {
    alignItems: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "70%"
  },
  aboutMeText: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "100"
  },
  aboutMeTextWrap: {
    alignItems: "center"
  },
  inputContainerStyle: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  inputStyle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "100"
  },
  nameInputBox: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    borderBottomWidth: 1,
    borderColor: "#fff",
    fontWeight: "100",
    paddingVertical: 9
    //borderRadius: 4,
    //borderWidth: 0.5,
    //borderColor: "#d6d7da"
  },
  birthdatePicker: {
    width: "45%",
    color: "#fff",
    position: "absolute",
    left: "0%"
  },
  genderpPickerWrap: {
    position: "absolute",
    right: "0%",
    width: "45%"
  },
  birthdateAndGenderWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: "20%"
  },
  countryPickerWrap: {
    width: "45%",
    position: "absolute",
    left: "0%",
    paddingTop: "4%"
  },
  zipCodeInput: {
    color: "#fff",
    fontSize: 15,
    textAlign: "left",
    borderBottomWidth: 1,
    borderColor: "#fff",
    fontWeight: "100",
    paddingVertical: 9
  },
  zipCodeInputWrap: {
    width: "45%",
    position: "absolute",
    right: "0%"
  },
  countryAndZipCodeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: "15%"
  },
  warningText: {
    color: "red",
    fontSize: 10,
    paddingTop: "3%",
    fontWeight: "bold"
  }
});

const genderPicker = {
  inputIOS: {
    color: "#fff",
    borderBottomWidth: 1,
    borderColor: "#fff",
    fontSize: 15,
    fontWeight: "100",
    paddingVertical: 10.5,
    paddingHorizontal: 9
  },
  placeholder: {
    color: "#fff",
    fontWeight: "100"
  }
};

const birthdatePickerCustom = {
  dateIcon: {
    //display: "none"
  },
  dateInput: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  dateText: {
    color: "#fff",
    fontSize: 13,
    position: "absolute",
    left: "0%",
    fontWeight: "100",
    paddingHorizontal: 9
  },
  placeholderText: {
    color: "#fff",
    fontSize: 15,
    position: "absolute",
    left: "0%",
    fontWeight: "100",
    paddingHorizontal: 9
  }
};

const countryPicker = {
  inputIOS: {
    width: "90%",
    color: "#fff",
    borderBottomWidth: 1,
    borderColor: "#fff",
    fontSize: 15,
    fontWeight: "100",
    paddingVertical: 9,
    paddingHorizontal: 9
  },
  placeholder: {
    color: "#fff",
    fontWeight: "100",
    paddingVertical: 9
  }
};

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetProfilePersonalAction: payload =>
      dispatch(SetProfilePersonalAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutYou);
