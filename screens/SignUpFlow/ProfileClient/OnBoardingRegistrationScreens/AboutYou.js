import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";

//Redux
import { connect } from "react-redux";
import SetAboutYouDataAction from "../../../../storage/actions/RegistrationActions/SetAboutYouDataAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//pickers
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";

//data
import { countries, genders } from "../Data/CountriesAndGenders.js";

//icons
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

//Collapsible Components
import LoadingScreen from "../Components/LoadingScreen";

class AboutYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birthDate: "",
      gender: "",
      country: "",
      firstName: "",
      lastName: "",
      zipCode: "",
      passed: false,
      firstNameWarning: "empty",
      lastNameWarning: "empty",
      genderWarning: "empty",
      countryWarning: "empty",
      zipCodeWarning: "empty",
      birthDateWarning: "empty",
      internalErrorWarning: false,
      isLoading: true
    };
    this.isContinueUserFetched = false;
  }

  getData = async () => {
    //do something with redux
    await fetch("http://74.80.250.210:5000/api/profile/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gui: this.props.CreateProfileDataReducer.gui,
        collection: "aboutYou"
      })
    })
      .then(res => res.json())
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        console.log(object);
        if (object.success) {
          this.setState({
            firstName: object.result.firstName,
            lastName: object.result.lastName,
            birthDate: object.result.birthDate,
            gender: object.result.gender,
            country: object.result.country,
            zipCode: object.result.zipCode,
            firstNameWarning: "",
            lastNameWarning: "",
            birthDateWarning: "",
            genderWarning: "",
            countryWarning: "",
            zipCodeWarning: "",
            isLoading: true,
            passed: true
          });
        } else {
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //throw to is loading screen or ask user to click a button for refetch
        //to fetch the data
        this.setState({
          isLoading: false
        });
      });
  };

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
      //any changes will remove the check mark from CollapsibleComponent CheckMark
      this.props.handlePassed("aboutYou", 2);
    }

    if (prevProps.aboutYouToggle !== this.props.aboutYouToggle) {
      if (
        this.props.aboutYouToggle &&
        this.props.CreateProfileDataReducer.isContinueUser
      ) {
        if (!this.isContinueUserFetched) {
          this.getData();
          this.isContinueUserFetched = true;
        }
      }
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
      firstName = false;
      this.setState({
        firstNameWarning: "empty"
      });
    } else if (!this.checkName(this.state.firstName)) {
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
      lastName = false;
      this.setState({
        lastNameWarning: "empty"
      });
    } else if (!this.checkName(this.state.lastName)) {
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
      zipCode = false;
      this.setState({
        zipCodeWarning: "empty"
      });
    } else if (!this.checkZipCode(this.state.zipCode)) {
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
      birthDate = false;
      this.setState({
        birthDateWarning: "empty"
      });
    } else if (!this.checkage(this.state.birthDate)) {
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
      this.setState({
        passed: true
      });
    } else {
      this.setState({
        passed: false
      });
    }
  };

  //next button : valid all input fields
  handleSubmit = evt => {
    if (this.state.passed) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      let index = 1;
      checklist = [
        ...checklist.slice(0, index),
        true,
        ...checklist.slice(index + 1)
      ];
      this.props.SetChecklistAction({
        checklist: checklist
      });

      fetch("http://74.80.250.210:5000/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gui: this.props.CreateProfileDataReducer.gui,
          collection: "aboutYou",
          data: {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            birthDate: this.state.birthDate,
            gender: this.state.gender,
            country: this.state.country,
            zipCode: this.state.zipCode,
            checklist: checklist
          }
        })
      })
        .then(res => res.json())
        .then(res => {
          let object = JSON.parse(JSON.stringify(res));
          console.log(object);
          if (object.success) {
            //Send Data to Redux
            this.props.SetAboutYouDataAction({
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              birthDate: this.state.birthDate,
              gender: this.state.gender,
              country: this.state.country,
              zipCode: this.state.zipCode
            });
            //if successed to passed, it will put the check mark from CollapsibleComponent CheckMark
            this.setState(
              {
                internalErrorWarning: false
              },
              () => {
                this.props.handlePassed("aboutYou", 1);
              }
            );
          } else {
            throw new Error("Internal Error ");
          }
        })
        .catch(error => {
          //if failed to passed, it will remove the check mark from CollapsibleComponent CheckMark
          this.setState(
            {
              internalErrorWarning: true
            },
            () => {
              this.props.handlePassed("aboutYou", 3);
            }
          );
        });
    }
  };

  SuccessScreen = () => {
    let passed = <View style={styles.warningText} />;

    let invalidFirstNameWarning = (
      <Text style={styles.warningText}>
        * Please enter a valid first name (letters and spaces)
      </Text>
    );
    let invalidLastNameWarning = (
      <Text style={styles.warningText}>
        * Please enter a valid last name (letters and spaces)
      </Text>
    );
    let invalidBirthDateWarning = (
      <Text style={styles.warningText}>
        * Please enter a valid birth date (at least 18)
      </Text>
    );
    let invalidGenderWarning = (
      <Text style={styles.warningText}>* Please enter a valid gender</Text>
    );

    let invalidCountryWarning = (
      <Text style={styles.warningText}>* Please enter a valid gender</Text>
    );

    let invalidZipCodeWarning = (
      <Text style={styles.warningText}>* Please enter a valid zip code</Text>
    );
    //work for first, last, zip, birth
    let empty = <Text style={styles.warningText}>* Required</Text>;

    let internalErrorWarning = (
      <Text style={styles.warningText}>* Internal Error. Please Try again</Text>
    );

    return (
      <View style={{ flex: 1 }}>
        {this.state.internalErrorWarning && internalErrorWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
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
            value={this.state.firstName}
            rightIcon={
              this.state.firstNameWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            onChangeText={firstName =>
              this.setState({ firstName }, () => {
                this.firstNameChecker();
              })
            }
          />
          {this.state.firstNameWarning === "empty" && empty}
          {this.state.firstNameWarning === "invalid" && invalidFirstNameWarning}
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
            value={this.state.lastName}
            rightIcon={
              this.state.lastNameWarning === "" ? (
                <Icon type="font-awesome" name="check" color="#fff" />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#fff"
                />
              )
            }
            onChangeText={lastName =>
              this.setState({ lastName }, () => {
                this.lastNameChecker();
              })
            }
          />
          {this.state.lastNameWarning === "empty" && empty}
          {this.state.lastNameWarning === "invalid" && invalidLastNameWarning}
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
              style={{ width: "100%" }}
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
                    style={{ top: 0, right: 15 }}
                    color="#fff"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="#fff"
                    size={24}
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
                    style={{ top: 15, right: 15 }}
                    color="#fff"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="#fff"
                    size={24}
                    iconStyle={{ top: 8, right: 10 }}
                  />
                );
              }}
            />
            {this.state.genderWarning === "empty" && empty}
            {this.state.genderWarning === "invalid" && invalidGenderWarning}
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
                    style={{ top: 15, right: 15 }}
                    color="#fff"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="#fff"
                    size={24}
                    iconStyle={{ top: 5, right: 10 }}
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
              value={this.state.zipCode}
              rightIcon={
                this.state.zipCodeWarning === "" ? (
                  <Icon type="font-awesome" name="check" color="#fff" />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="#fff"
                  />
                )
              }
              onChangeText={zipCode =>
                this.setState({ zipCode }, () => {
                  this.zipCodeChecker();
                })
              }
            />
            {this.state.zipCodeWarning === "empty" && empty}
            {this.state.zipCodeWarning === "invalid" && invalidZipCodeWarning}
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
  };

  loadingScreen = () => {
    //display fetching data
    return <LoadingScreen />;
  };

  render() {
    return this.state.isLoading ? this.SuccessScreen() : this.loadingScreen();
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
    color: "#fff",
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
    SetAboutYouDataAction: payload => dispatch(SetAboutYouDataAction(payload)),
    SetChecklistAction: payload => dispatch(SetChecklistAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutYou);
