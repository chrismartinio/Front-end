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
  TextInput,
  Picker,
  DatePickerIOS,
  TouchableHighlight,
  KeyboardAvoidingView
} from "react-native";
import { LinearGradient } from "expo";
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";
import { countries, genders } from "./someData.js";

class AboutYou extends React.Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};

    this.state = {
      date: "",
      clicked: false,
      gender: "",
      country: "",
      firstName: "",
      lastName: "",
      zipCode: "",
      passed: true
    };
  }

  checkZipCode = zipcode => {
    return /^\d{5}(-\d{4})?$/.test(zipcode);
  };

  checkName = string => {
    //Have atleast one character
    //maybe? a user would like to have number in their name ??
    if (/^[a-zA-Z]+$/.test(string)) {
      return true;
    }
    return false;
  };

  maxDate = () => {
    let d = new Date();
    //User has to be at least 18 year olds
    //Current Year - 18
    let year = d.getFullYear() - 18;
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  };

  minDate = () => {
    let d = new Date();
    //assume 120 year olds
    let year = d.getFullYear() - 120;
    let month = d.getMonth() + 1;
    let day = d.getDate();
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  };

  handleSubmit = evt => {
    let passed = true;
    //check if it's empty
    if (
      this.state.gender === "" ||
      this.state.country === "" ||
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.zipCode === ""
    ) {
      passed = false;
    }

    //checkName

    if (
      !(
        this.checkName(this.state.firstName) &&
        this.checkName(this.state.lastName)
      )
    ) {
      passed = false;
    }

    //check zipCode
    if (this.checkZipCode(this.state.zipCode) === false) {
      passed = false;
    }a

    //if all meet the requirement, then display the warning text
    if (passed === false) {
      this.setState({
        passed: false
        })} else {
      //if meet all the requirement, then undisplay the warning text
      //pass values to redux store
      //navigate to next page
      this.props.navigation.navigate('TestTellUsMore');
      this.setState(
        {
          passed: true
        },
        () => {
          //this.props.navigate("")
          /*redux store here
           */
        }
      );
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient colors={["#18cdf6", "#43218c"]} style={{ flex: 1 }}>
          <ScrollView>
            <KeyboardAvoidingView behavior="height" enabled>
              <View style={styles.wholeWrap}>
                {/**About You Text */}
                <View style={styles.aboutMeTextWrap}>
                  <Text style={styles.aboutMeText}>About You</Text>
                </View>
                {/**firstName */}
                <View style={styles.firstNameInputWrap}>
                  <View style={{ width: "100%" }}>
                    <TextInput
                      style={styles.nameInputBox}
                      placeholder="first name"
                      onChangeText={firstName => this.setState({ firstName })}
                      placeholderTextColor="#fff"
                    />
                  </View>
                </View>
                {/**lastName */}
                <View style={styles.lastNameInputWrap}>
                  <View style={{ width: "100%" }}>
                    <TextInput
                      style={styles.nameInputBox}
                      placeholder="last name"
                      onChangeText={lastName => this.setState({ lastName })}
                      placeholderTextColor="#fff"
                    />
                  </View>
                </View>
                {/**birth and gender Wrap */}
                <View style={styles.birthdateAndGenderWrap}>
                  {/**birth */}
                  <View style={styles.birthdatePicker}>
                    <DatePicker
                      style={{ width: "90%" }}
                      date={
                        this.state.clicked === false
                          ? this.state.clicked
                          : this.state.date
                      }
                      mode="date"
                      placeholder="birthdate"
                      format="YYYY-MM-DD"
                      minDate={this.minDate()}
                      maxDate={this.maxDate()}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={birthdatePickerCustom}
                      onDateChange={date => {
                        this.setState({ date: date, clicked: true });
                      }}
                    />
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
                      ref={el => {
                        this.inputRefs.picker = el;
                      }}
                    />
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
                      ref={el => {
                        this.inputRefs.picker = el;
                      }}
                    />
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
                    />
                  </View>
                </View>
                <View>
                  {this.state.passed === false ? (
                    <Text style={styles.warningText}>*All field Required</Text>
                  ) : (
                    <View style={styles.warningText} />
                  )}
                </View>
              </View>
              <View alignItems="center" top={"30%"}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleSubmit}
                >
                  <Text style={{ color: "#fff" }}>Next</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  aboutMeText: {
    color: "#fff",
    fontSize: 45
  },
  aboutMeTextWrap: {
    alignItems: "center"
  },
  nameInputBox: {
    color: "#fff",
    fontSize: 15,
    textAlign: "left",
    borderBottomWidth: 1,
    borderColor: "#fff",
    fontWeight: "bold",
    paddingVertical: 9
  },
  firstNameInputWrap: {
    alignItems: "center",
    paddingTop: "10%"
  },
  lastNameInputWrap: {
    alignItems: "center",
    paddingTop: "5%",
    paddingBottom: "10%"
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
    paddingBottom: "20%"
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
    fontWeight: "bold",
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
    paddingBottom: "15%"
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
  buttonText: {
    padding: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  warningText: {
    color: "#fff",
    fontSize: 8
  },
  wholeWrap: {
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: "40%",
    marginBottom: "10%"
  }
});

const genderPicker = {
  inputIOS: {
    color: "#fff",
    borderBottomWidth: 1,
    borderColor: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 10.5
  },
  placeholder: {
    color: "#fff",
    fontWeight: "bold"
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
    fontWeight: "bold"
  },
  placeholderText: {
    color: "#fff",
    fontSize: 15,
    position: "absolute",
    left: "0%",
    fontWeight: "bold"
  }
};

const countryPicker = {
  inputIOS: {
    width: 120,
    color: "#fff",
    borderBottomWidth: 1,
    borderColor: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 9
  },
  placeholder: {
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 9
  }
};

export default AboutYou;
