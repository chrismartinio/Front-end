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
import SetProfilePersonalAction from "../../storage/actions/SetProfilePersonalAction";
import firebase from "../../utils/mainFire";
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";
import { countries, genders } from "./someData.js";

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
      empty: true,
      passed: true,
      firstNameWarning: false,
      lastNameWarning: false,
      genderWarning: false,
      countryWarning: false,
      zipCodeWarning: false,
      birthDateWarning: false
    };
  }

  checkZipCode = zipcode => {
    return /^\d{5}(-\d{4})?$/.test(zipcode);
  };

  checkName = string => {
    //Have atleast one character
    //maybe? a user would like to have number in their name ??
    let regExp = /^[a-zA-Z\s]*$/;
    if (regExp.test(string)) {
      return true;
    }
    return false;
  };

  maxDate = () => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  };

  minDate = () => {
    let d = new Date();
    //assume 120 year olds
    let year = d.getFullYear() - 150;
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  };

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

  handleSubmit = evt => {
    let firstName = false,
      lastName = false,
      birthDate = false,
      gender = false,
      country = false,
      zipCode = false;

    if (
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.birthDate === "" ||
      this.state.gender === "" ||
      this.state.country === "" ||
      this.state.zipCode === ""
    ) {
      this.setState({
        empty: true
      });
    } else {
      this.setState({
        empty: false
      });
    }

    //checkFirstName
    if (this.state.firstName !== "" && this.checkName(this.state.firstName)) {
      //if not empty and passed the checkName(), set firstName = true
      firstName = true;
      /*
      this.firstNameInputRef.current.setNativeProps({
        style: { borderColor: "#fff" }
      });
      */
      this.setState({
        firstNameWarning: false
      });
    } else {
      console.log("Invalid FirstName");
      this.setState({
        firstNameWarning: true
      });
      //console.log(this.inputRefs.current.props.style)
      /*
      this.firstNameInputRef.current.setNativeProps({
        style: { borderColor: "red" }
      });
      */
    }

    //checkLastName
    if (this.state.lastName !== "" && this.checkName(this.state.lastName)) {
      //if not empty and passed the checkName(), set lastName = true
      lastName = true;
      this.setState({
        lastNameWarning: false
      });
    } else {
      console.log("Invalid LastName");
      this.setState({
        lastNameWarning: true
      });
    }

    //checkBirth
    if (this.state.birthDate !== "" && this.checkage(this.state.birthDate)) {
      //if not empty, set birthDate = true
      birthDate = true;
      this.setState({
        birthDateWarning: false
      });
    } else {
      console.log("Invalid birthDate");
      this.setState({
        birthDateWarning: true
      });
    }

    //checkGender
    if (this.state.gender !== "") {
      //if not empty, set gender = true
      gender = true;
      this.setState({
        genderWarning: false
      });
    } else {
      this.setState({
        genderWarning: true
      });
    }

    //checkCountry
    if (this.state.country !== "") {
      //if not empty, set country = true
      country = true;
      this.setState({
        countryWarning: false
      });
    } else {
      console.log("Invalid country");
      this.setState({
        countryWarning: true
      });
    }

    //checkZipCode
    if (this.state.zipCode !== "" && this.checkZipCode(this.state.zipCode)) {
      //if not empty, set zipCode = true
      zipCode = true;
      this.setState({
        zipCodeWarning: false
      });
    } else {
      console.log("Invalid zipCode");
      this.setState({
        zipCodeWarning: true
      });
    }

    //if all tests passed, set passed to true and navigate to next screen
    if (!(firstName && lastName && birthDate && gender && country && zipCode)) {
      //passed is set to true by default
      //When user first click, and doesn't meet all requirement, set passed to false
      //purpose of this is to not display "all field required" for first time
      this.setState({
        passed: false
      });
    } else {
      //if all tests passed, set passed to true and navigate to next screen
      this.setState(
        {
          passed: true
        },
        () => {
          this.props.navigation.navigate("TestTellUsMore");
        }
      );
    }
  };

  render() {
    let invalidDataWarning = (
      <Text style={styles.warningText}>* Invalid Data</Text>
    );

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
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
                {/**About You Text */}
                <View style={styles.aboutMeTextWrap}>
                  <Text style={styles.aboutMeText}>About You</Text>
                </View>
                {/*Spaces*/}
                <View style={{ padding: "5%" }} />

                {/**firstName */}
                <View style={{ width: "100%" }}>
                  <TextInput
                    style={styles.nameInputBox}
                    placeholder="first name "
                    onChangeText={firstName => this.setState({ firstName })}
                    placeholderTextColor="#fff"
                  />
                </View>
                {this.state.firstNameWarning && invalidDataWarning}
                {/*Spaces*/}
                <View style={{ padding: "3%" }} />

                {/**lastName */}
                <View style={{ width: "100%" }}>
                  <TextInput
                    style={styles.nameInputBox}
                    placeholder="last name"
                    onChangeText={lastName => this.setState({ lastName })}
                    placeholderTextColor="#fff"
                  />
                </View>
                {this.state.lastNameWarning && invalidDataWarning}
                {/*Spaces*/}
                <View style={{ padding: "3%" }} />

                {/**birth and gender Wrap */}
                <View style={styles.birthdateAndGenderWrap}>
                  {/**birth */}
                  <View style={styles.birthdatePicker}>
                    <DatePicker
                      style={{ width: "90%" }}
                      date={this.state.birthDate}
                      mode="date"
                      placeholder="birthdate"
                      format="YYYY-MM-DD"
                      minDate={this.minDate()}
                      maxDate={this.maxDate()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={birthdatePickerCustom}
                      onDateChange={date => {
                        this.setState({ birthDate: date });
                      }}
                    />
                    {this.state.birthDateWarning && invalidDataWarning}
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
                        this.setState({
                          gender: value
                        });
                      }}
                      value={this.state.gender}
                    />
                    {this.state.genderWarning && invalidDataWarning}
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
                        this.setState({
                          country: value
                        });
                      }}
                      value={this.state.country}
                    />
                    {this.state.countryWarning && invalidDataWarning}
                  </View>

                  {/**zip */}
                  <View style={styles.zipCodeInputWrap}>
                    <TextInput
                      style={styles.zipCodeInput}
                      placeholder="zip code"
                      name="zipCode"
                      onChangeText={zipCode => this.setState({ zipCode })}
                      value={this.state.zipCode}
                      placeholderTextColor="#fff"
                      autoCompleteType={false}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    {this.state.zipCodeWarning && invalidDataWarning}
                  </View>
                </View>
                {/*Spaces*/}
                <View style={{ padding: "3%" }} />

                {/*Empty Data exist*/}
                <View>
                  {this.state.empty === true ? (
                    <Text style={styles.warningText}>*All field Required</Text>
                  ) : (
                    <View style={styles.warningText} />
                  )}
                </View>
                {/*Spaces*/}
                <View style={{ padding: "10%" }} />

                {/*Next Button*/}
                <View
                  style={{
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.handleSubmit}
                  >
                    <Text style={{ color: "#fff" }}>Next</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }} />
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
  wholeWrap: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
    marginTop: "40%",
    marginLeft: "5%",
    marginRight: "5%"
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
  aboutMeText: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "100"
  },
  aboutMeTextWrap: {
    alignItems: "center"
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
    left: "0%"
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
    color: "#fff",
    fontSize: 8
  }
});

const genderPicker = {
  inputIOS: {
    color: "#fff",
    borderBottomWidth: 1,
    borderColor: "#fff",
    fontSize: 15,
    fontWeight: "100",
    paddingVertical: 10.5
  },
  placeholder: {
    color: "#fff",
    fontWeight: "100"
  }
};

const birthdatePickerCustom = {
  dateIcon: {
    display: "none"
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
    fontWeight: "100"
  },
  placeholderText: {
    color: "#fff",
    fontSize: 15,
    position: "absolute",
    left: "0%",
    fontWeight: "100"
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
    paddingVertical: 9
  },
  placeholder: {
    color: "#fff",
    fontWeight: "100",
    paddingVertical: 9
  }
};

export default AboutYou;
