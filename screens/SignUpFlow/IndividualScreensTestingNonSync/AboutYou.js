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
      passed: true,
      firstNameWarning: "",
      lastNameWarning: "",
      genderWarning: "",
      countryWarning: "",
      zipCodeWarning: "",
      birthDateWarning: ""
    };
  }

  //return true/false for valid zipcode
  checkZipCode = zipcode => {
    return /^\d{5}(-\d{4})?$/.test(zipcode);
  };

  //return true/false for valid first name and last name
  checkName = string => {
    //Have atleast one character
    //maybe? a user would like to have number in their name ??
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

  //next button : valid all input fields
  handleSubmit = evt => {
    let firstName = false,
      lastName = false,
      birthDate = false,
      gender = false,
      country = false,
      zipCode = false;

    //check invalid/empty firstName
    if (this.state.firstName === "") {
      console.log("Empty FirstName")
      firstName = false;
      this.setState({
        firstNameWarning: "empty"
      });
    } else if (!this.checkName(this.state.firstName)) {
      console.log("Invalid FirstName")
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

    //check invalid/empty lastName
    if (this.state.lastName === "") {
      console.log("Empty LastName")
      lastName = false;
      this.setState({
        lastNameWarning: "empty"
      });
    } else if (!this.checkName(this.state.lastName)) {
      console.log("Invalid LastName")
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

    //check invalid/empty birthDate
    if (this.state.birthDate === "") {
      console.log("Empty Birthdate")
      birthDate = false;
      this.setState({
        birthDateWarning: "empty"
      });
    } else if (!this.checkage(this.state.birthDate)) {
      console.log("Invalid Birthdate")
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

    //check invalid/empty gender
    if (this.state.gender === "") {
      console.log("Empty Gender")
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

    //check invalid/empty country
    if (this.state.country === "") {
      console.log("Empty Country")
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

    //check invalid/empty zipCode
    if (this.state.zipCode === "") {
      console.log("Empty ZipCode")
      zipCode = false;
      this.setState({
        zipCodeWarning: "empty"
      });
    } else if (!this.checkZipCode(this.state.zipCode)) {
      console.log("Invalid ZipCode")
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

    //check input field empty
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

    if (!(firstName && lastName && birthDate && gender && country && zipCode)) {
      //passed is set to true by default
      //When user first click, and doesn't meet all requirement, set passed to false
      //purpose of this is to not display "all field required" for user first time visit this screen
      this.setState({
        passed: false
      });
    } else {
      //if all tests passed, set passed to true and navigate to next screen
      console.log("Passed")
      this.setState(
        {
          passed: true
        },
        () => {
          //console.log("data here")
          //console.log(this.props.CreateProfileReducer.data)
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
      );
    }
  };

  render() {
    let passed = <View style={styles.warningText} />;

    let invalidFirstNameLastNameWarning = (
      <Text style={styles.warningText}>* Only Accept Letters and Spaces. </Text>
    );
    let invalidBirthDateWarning = (
      <Text style={styles.warningText}>* You MUST be at least 18!</Text>
    );
    let invalidGenderCountryWarning = (
      <Text style={styles.warningText}>* Field cannot be empty!</Text>
    );
    let invalidZipCodeWarning = (
      <Text style={styles.warningText}>* Zip code MUST be 5 digits</Text>
    );
    let empty = <Text style={styles.warningText}>* Empty field</Text>;

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
                {/*Spaces*/}
                <View
                  style={{
                    padding: "30%"
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
                    padding: "5%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/**firstName */}
                <View style={{ width: "100%" }}>
                  <TextInput
                    style={styles.nameInputBox}
                    placeholder="first name "
                    onChangeText={firstName => this.setState({ firstName })}
                    placeholderTextColor="#fff"
                  />
                </View>
                {this.state.firstNameWarning === "empty" && empty}
                {this.state.firstNameWarning === "invalid" &&
                  invalidFirstNameLastNameWarning}

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
                  <TextInput
                    style={styles.nameInputBox}
                    placeholder="last name"
                    onChangeText={lastName => this.setState({ lastName })}
                    placeholderTextColor="#fff"
                  />
                </View>
                {this.state.lastNameWarning === "empty" && empty}
                {this.state.lastNameWarning === "invalid" &&
                  invalidFirstNameLastNameWarning}

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
                        this.setState({
                          gender: value
                        });
                      }}
                      value={this.state.gender}
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
                        this.setState({
                          country: value
                        });
                      }}
                      value={this.state.country}
                    />
                    {this.state.countryWarning === "empty" && empty}
                    {this.state.countryWarning === "invalid" &&
                      invalidGenderCountryWarning}
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
                    {this.state.zipCodeWarning === "empty" && empty}
                    {this.state.zipCodeWarning === "invalid" &&
                      invalidZipCodeWarning}
                  </View>
                </View>

                {/*Empty Data exist*/}
                <View>
                  {this.state.empty ? (
                    <Text style={styles.warningText}>* all field Required</Text>
                  ) : (
                    <View style={styles.warningText} />
                  )}
                </View>

                {/*Spaces*/}
                <View
                  style={{
                    padding: "20%"
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
    fontSize: 8,
    paddingTop: "3%"
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
