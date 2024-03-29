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
import { LinearGradient } from 'expo-linear-gradient'

import { connect } from "react-redux";
//import SetProfilePersonalAction from "../../storage/actions/SetProfilePersonalAction";
//import SetProfilePersonalAction from "../../../../storage/actions/SetProfilePersonalAction";
//import firebase from "../../../utils/mainFire";
import firebase from "../../../../utils/mainFire";
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)
    if (
      this.state.firstNameWarning !== prevState.firstNameWarning ||
      this.state.lastNameWarning !== prevState.lastNameWarning ||
      this.state.birthDateWarning !== prevState.birthDateWarning ||
      this.state.genderWarning !== prevState.genderWarning ||
      this.state.countryWarning !== prevState.countryWarning ||
      this.state.zipCodeWarning !== prevState.zipCodeWarning
    ) {
      this.allChecker();
    }
  }

  //format checker below

  //return true/false for valid zipcode
  checkZipCode = zipcode => {
    return /^\d{5}(-\d{4})?$/.test(zipcode);
  };

  //return true/false for valid first name and last name
  checkName = string => {
    //check if string has only space
    if (!string.replace(/\s/g, "").length) {
      return false;
    }

    //check letters and spaces
    let regExp = /^[a-zA-Z\s]*$/;
    if (regExp.test(string)) {
      return true;
    }
    return false;
  };

  //date picker method : return maximun date (current date) that user can pick
  maxDate = () => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  };

  //date picker method : return minimum date (current date - 150) that user can pick
  minDate = () => {
    let d = new Date();
    //assume 120 year olds
    let year = d.getFullYear() - 150;
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  };

  //return true/false for valid birthdate (over 18)
  checkage = birthdate => {
    let byear = parseInt(birthdate.slice(0, 4));
    let bmonth = parseInt(birthdate.slice(5, 7));
    let bday = parseInt(birthdate.slice(8, 10));

    let d = new Date();
    let age = d.getFullYear() - byear;
    let month = d.getMonth() + 1 - bmonth;
    if (month < 0 || (month === 0 && d.getDate() < bday)) {
      age--;
    }

    if (age < 18) {
      return false;
    }

    return true;
  };
  //Format Checker above

  //checkers
  firstNameChecker = () => {
    if (this.state.firstName === "") {
      console.log("Empty FirstName");
      firstName = false;
      this.setState({
        firstNameWarning: "empty"
      });
    } else if (!this.checkName(this.state.firstName)) {
      console.log("Invalid FirstName");
      firstName = false;
      this.setState({
        firstNameWarning: "invalid"
      });
    } else {
      firstName = true;
      this.setState({
        firstNameWarning: ""
      });
    }
  };

  lastNameChecker = () => {
    //check invalid/empty lastName
    if (this.state.lastName === "") {
      console.log("Empty LastName");
      lastName = false;
      this.setState({
        lastNameWarning: "empty"
      });
    } else if (!this.checkName(this.state.lastName)) {
      console.log("Invalid LastName");
      lastName = false;
      this.setState({
        lastNameWarning: "invalid"
      });
    } else {
      lastName = true;
      this.setState({
        lastNameWarning: ""
      });
    }
  };

  zipCodeChecker = () => {
    //check invalid/empty zipCode
    if (this.state.zipCode === "") {
      console.log("Empty ZipCode");
      zipCode = false;
      this.setState({
        zipCodeWarning: "empty"
      });
    } else if (!this.checkZipCode(this.state.zipCode)) {
      console.log("Invalid ZipCode");
      zipCode = false;
      this.setState({
        zipCodeWarning: "invalid"
      });
    } else {
      zipCode = true;
      this.setState({
        zipCodeWarning: ""
      });
    }
  };

  birthDateChecker = () => {
    //check invalid/empty birthDate
    if (this.state.birthDate === "") {
      console.log("Empty Birthdate");
      birthDate = false;
      this.setState({
        birthDateWarning: "empty"
      });
    } else if (!this.checkage(this.state.birthDate)) {
      console.log("Invalid Birthdate");
      birthDate = false;
      this.setState({
        birthDateWarning: "invalid"
      });
    } else {
      birthDate = true;
      this.setState({
        birthDateWarning: ""
      });
    }
  };

  genderChecker = () => {
    //check invalid/empty gender
    if (this.state.gender === "" || this.state.gender === null) {
      console.log("Empty Gender");
      gender = false;
      this.setState({
        genderWarning: "empty"
      });
    } else {
      gender = true;
      this.setState({
        genderWarning: ""
      });
    }
  };

  countryChecker = () => {
    //check invalid/empty country
    if (this.state.country === "" || this.state.country === null) {
      console.log("Empty Country");
      country = false;
      this.setState({
        countryWarning: "empty"
      });
    } else {
      country = true;
      this.setState({
        countryWarning: ""
      });
    }
  };

  allChecker = () => {
    if (
      this.state.firstNameWarning === "" &&
      this.state.lastNameWarning === "" &&
      this.state.birthDateWarning === "" &&
      this.state.genderWarning === "" &&
      this.state.countryWarning === "" &&
      this.state.zipCodeWarning === ""
    ) {
      this.setState(
        {
          passed: true
        },
        () => {
          console.log("passed");
        }
      );
    } else {
      this.setState(
        {
          passed: false
        },
        () => {
          console.log("not passed");
        }
      );
    }
  };

  //next button : valid all input fields
  handleSubmit = evt => {
    if (this.state.passed) {
      //if all tests passed, set passed to true and navigate to next screen
      console.log("Passed");
      this.props.SetProfilePersonalAction({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        birthDate: this.state.birthDate,
        gender: this.state.gender,
        country: this.state.country,
        zipCode: this.state.zipCode
      });
      this.props.navigation.navigate("TestTellUsMore");
    }
  };

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

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.select({
          ios: () => -100,
          android: () => 200
        })()}
        style={{ flex: 1 }}
      >
        <LinearGradient
          textStyle={{ color: "#fff" }}
          colors={["#18cdf6", "#43218c"]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.wholeWrap}>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "20%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />
                {/**About You Text */}
                <View style={styles.aboutMeTextWrap}>
                  <Text style={styles.aboutMeText}>About You</Text>
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

                {/**firstName */}
                <View style={{ width: "100%" }}>
                  <Input
                    placeholder="first name"
                    placeholderTextColor="#fff"
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    rightIcon={
                      this.state.firstNameWarning === ""
                        ? {
                            type: "font-awesome",
                            name: "check",
                            color: "orange"
                          }
                        : {
                            type: "font-awesome",
                            name: "exclamation-circle",
                            color: "#FF4500"
                          }
                    }
                    onChangeText={firstName =>
                      this.setState({ firstName }, () => {
                        this.firstNameChecker();
                      })
                    }
                  />
                  {this.state.firstNameWarning === "empty" && empty}
                  {this.state.firstNameWarning === "invalid" &&
                    invalidFirstNameLastNameWarning}
                </View>

                {/*Spaces*/}
                <View
                  style={{
                    padding: "5%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/**lastName */}
                <View style={{ width: "100%" }}>
                  <Input
                    placeholder="last name"
                    placeholderTextColor="#fff"
                    containerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    rightIcon={
                      this.state.lastNameWarning === ""
                        ? {
                            type: "font-awesome",
                            name: "check",
                            color: "orange"
                          }
                        : {
                            type: "font-awesome",
                            name: "exclamation-circle",
                            color: "#FF4500"
                          }
                    }
                    onChangeText={lastName =>
                      this.setState({ lastName }, () => {
                        this.lastNameChecker();
                      })
                    }
                  />
                  {this.state.lastNameWarning === "empty" && empty}
                  {this.state.lastNameWarning === "invalid" &&
                    invalidFirstNameLastNameWarning}
                </View>

                <View
                  style={{
                    padding: "5%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/**birth and gender Wrap */}
                <View style={styles.birthdateAndGenderWrap}>
                  {/**birth */}
                  <View style={styles.birthdatePicker}>
                    <DatePicker
                      style={{ width: "97%" }}
                      date={this.state.birthDate}
                      mode="date"
                      placeholder="birthdate"
                      format="YYYY-MM-DD"
                      minDate={this.minDate()}
                      maxDate={this.maxDate()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      iconComponent={
                        this.state.birthDateWarning === "" ? (
                          <Chevron
                            size={1.5}
                            style={{ top: 5, right: 15 }}
                            color="#fff"
                          />
                        ) : (
                          <Icon
                            type="font-awesome"
                            name="exclamation-circle"
                            color="#FF4500"
                            size={16}
                            iconStyle={{ top: 0, right: 15 }}
                          />
                        )
                      }
                      customStyles={birthdatePickerCustom}
                      onDateChange={date => {
                        this.setState({ birthDate: date }, () => {
                          this.birthDateChecker();
                        });
                      }}
                    />
                    {this.state.birthDateWarning === "empty" && empty}
                    {this.state.birthDateWarning === "invalid" &&
                      invalidBirthDateWarning}
                  </View>

                  {/**Gender */}
                  <View style={styles.genderpPickerWrap}>
                    <RNPickerSelect
                      style={genderPicker}
                      placeholder={{
                        label: "gender",
                        value: null
                      }}
                      items={genders}
                      onValueChange={value => {
                        this.setState(
                          {
                            gender: value
                          },
                          () => {
                            this.genderChecker();
                          }
                        );
                      }}
                      value={this.state.gender}
                      Icon={() => {
                        return this.state.genderWarning === "" ? (
                          <Chevron
                            size={1.5}
                            style={{ top: 20, right: 15 }}
                            color="#fff"
                          />
                        ) : (
                          <Icon
                            type="font-awesome"
                            name="exclamation-circle"
                            color="#FF4500"
                            size={16}
                            iconStyle={{ top: 13, right: 15 }}
                          />
                        );
                      }}
                    />
                    {this.state.genderWarning === "empty" && empty}
                    {this.state.genderWarning === "invalid" &&
                      invalidGenderCountryWarning}
                  </View>
                </View>

                {/**Country and ZipCode Wrap */}
                <View style={styles.countryAndZipCodeWrap}>
                  {/**country */}
                  <View style={styles.countryPickerWrap}>
                    <RNPickerSelect
                      style={countryPicker}
                      placeholder={{
                        label: "Country",
                        value: null
                      }}
                      items={countries}
                      onValueChange={value => {
                        this.setState(
                          {
                            country: value
                          },
                          () => {
                            this.countryChecker();
                          }
                        );
                      }}
                      value={this.state.country}
                      Icon={() => {
                        return this.state.countryWarning === "" ? (
                          <Chevron
                            size={1.5}
                            style={{ top: 20, right: 20 }}
                            color="#fff"
                          />
                        ) : (
                          <Icon
                            type="font-awesome"
                            name="exclamation-circle"
                            color="#FF4500"
                            size={16}
                            iconStyle={{ top: 11, right: 19 }}
                          />
                        );
                      }}
                    />
                    {this.state.countryWarning === "empty" && empty}
                    {this.state.countryWarning === "invalid" &&
                      invalidGenderCountryWarning}
                  </View>

                  {/**zip */}
                  <View style={styles.zipCodeInputWrap}>
                    <Input
                      placeholder="zip code"
                      placeholderTextColor="#fff"
                      containerStyle={styles.inputContainerStyle}
                      inputStyle={styles.inputStyle}
                      autoCompleteType={false}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      maxLength={5}
                      rightIcon={
                        this.state.zipCodeWarning === ""
                          ? {
                              type: "font-awesome",
                              name: "check",
                              color: "orange"
                            }
                          : {
                              type: "font-awesome",
                              name: "exclamation-circle",
                              color: "#FF4500",
                              size: 16,
                              iconStyle: { top: 4, right: 5 }
                            }
                      }
                      onChangeText={zipCode =>
                        this.setState({ zipCode }, () => {
                          this.zipCodeChecker();
                        })
                      }
                    />
                    {this.state.zipCodeWarning === "empty" && empty}
                    {this.state.zipCodeWarning === "invalid" &&
                      invalidZipCodeWarning}
                  </View>
                </View>

                {/*Spaces*/}
                <View
                  style={{
                    padding: "2%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {allEmptyWarning && (
                  <Text style={styles.warningText}>*all fields required</Text>
                )}

                {/*Spaces*/}
                <View
                  style={{
                    padding: "25%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/*Next Button*/}
                <View
                  style={{
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    style={
                      this.state.passed ? styles.passedButton : styles.button
                    }
                    onPress={this.handleSubmit}
                  >
                    <Text style={{ color: "#fff" }}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
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
