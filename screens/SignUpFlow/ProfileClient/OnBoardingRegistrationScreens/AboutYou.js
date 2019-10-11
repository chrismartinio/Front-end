import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
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
import FailScreen from "../Components/FailScreen";

//checker functions
import {
  checkZipCode,
  checkName,
  maxDate,
  minDate,
  checkage
} from "../Util/OnBoardingRegistrationScreenCheckers.js";

//warnings
import {
  invalidFirstNameWarning,
  invalidLastNameWarning,
  invalidBirthDateWarning,
  invalidGenderWarning,
  invalidCountryWarning,
  invalidZipCodeWarning,
  emptyWarning,
  internalErrorWarning
} from "../Util/OnBoardingRegistrationScreenWarnings.js";

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
      isSuccess: true,
      isDelaying: false
    };
    this.isContinueUserFetched = false;
  }

  getData = async () => {
    //if it is not ThirdPartiesServiceUser, it will check if it is continue user using checklist
    if (!this.props.CreateProfileDataReducer.isThirdPartiesServiceUser) {
      //continue user
      //if the checklist says this screen is not complete, return (do not query anything)
      if (!this.props.CreateProfileDataReducer.checklist.aboutYou) {
        return;
      }
    }

    await fetch("http://74.80.250.210:4000/api/profile/query", {
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
        //console.log(object);
        if (object.success) {
          let {
            firstName,
            lastName,
            birthDate,
            gender,
            country,
            zipCode
          } = object.result;

          this.setState({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            country: country,
            zipCode: zipCode,
            firstNameWarning: firstName === "" ? "empty" : "",
            lastNameWarning: lastName === "" ? "empty" : "",
            birthDateWarning: birthDate === "" ? "empty" : "",
            genderWarning: gender === "" ? "empty" : "",
            countryWarning: country === "" ? "empty" : "",
            zipCodeWarning: zipCode === "" ? "empty" : "",
            isSuccess: true
          });

          this.props.SetAboutYouDataAction({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            country: country,
            zipCode: zipCode
          });
        } else {
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //If error while fetching, direct user to failScreen
        this.setState({
          isSuccess: false
        });
      });
  };

  reset = () => {
    this.setState({
      isSuccess: true
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
      //For new user only, if something is modified, remove the check icon
      if (!this.props.CreateProfileDataReducer.isContinueUser) {
        this.props.handlePassed("aboutYou", 2);
      }
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

  //checkers
  firstNameChecker = () => {
    if (this.state.firstName === "") {
      firstName = false;
      this.setState({
        firstNameWarning: "empty"
      });
    } else if (!checkName(this.state.firstName)) {
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
    } else if (!checkName(this.state.lastName)) {
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
    } else if (!checkZipCode(this.state.zipCode)) {
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
    } else if (!checkage(this.state.birthDate)) {
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
    //if the screen passed and gui is not null (that means user had finished createAccount)
    if (this.state.passed && this.props.CreateProfileDataReducer.gui !== null) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      checklist.aboutYou = true;
      this.props.SetChecklistAction({
        checklist: checklist
      });

      this.setState(
        {
          isDelaying: true
        },
        () => {
          fetch("http://74.80.250.210:4000/api/profile/update", {
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
                //if successed to passed,
                this.setState(
                  {
                    internalErrorWarning: false,
                    isDelaying: false
                  },
                  () => {
                    // it will put a check mark for aboutYou
                    this.props.handlePassed("aboutYou", 1);
                  }
                );
              } else {
                throw new Error("Internal Error ");
              }
            })
            .catch(error => {
              //if error,
              this.setState(
                {
                  internalErrorWarning: true,
                  isDelaying: false
                },
                () => {
                  //put a error marker for aboutYou
                  this.props.handlePassed("aboutYou", 3);
                }
              );
            });
        }
      );
    } else {
      //if gui is null

      //User must has a gui retrieve from the createAccount screen before get to this screen
      //if there are no gui, give an error warning
      //the reason of no gui may come from internal error when inserting email/password into createAccount Collection
      //and error had thrown and gui didn't return back to client
      //user may need to re-sign in as continue user?

      this.setState(
        {
          internalErrorWarning: true,
          isDelaying: false
        },
        () => {
          this.props.handlePassed("aboutYou", 3);
        }
      );
    }
  };

  successScreen = () => {
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
          {this.state.firstNameWarning === "empty" && emptyWarning}
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
          {this.state.lastNameWarning === "empty" && emptyWarning}
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
              minDate={minDate()}
              maxDate={maxDate()}
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
            {this.state.birthDateWarning === "empty" && emptyWarning}
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
            {this.state.genderWarning === "empty" && emptyWarning}
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
            {this.state.countryWarning === "empty" && emptyWarning}
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
              autoCompleteType={"off"}
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
            {this.state.zipCodeWarning === "empty" && emptyWarning}
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
            disabled={
              (this.state.passed && this.state.isDelaying) || !this.state.passed
            }
          >
            {this.state.passed && this.state.isDelaying ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.button}>Next</Text>
            )}
          </TouchableOpacity>
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
          }}
        />
      </View>
    );
  };

  failScreen = () => {
    //For isContinueUser Only
    //If fail on fetching, then display a screen to tell them try again
    return <FailScreen getDataFunction={this.getData} reset={this.reset} />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.failScreen();
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
  inputContainerStyle: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  inputStyle: {
    color: "#fff",
    fontSize: 15
  },
  nameInputBox: {
    color: "white",
    fontSize: 15,
    textAlign: "left",
    borderBottomWidth: 1,
    borderColor: "#fff",
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
    paddingVertical: 10.5,
    paddingHorizontal: 9
  },
  placeholder: {
    color: "#fff"
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
    paddingHorizontal: 9
  },
  placeholderText: {
    color: "#fff",
    fontSize: 15,
    position: "absolute",
    left: "0%",
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
    paddingVertical: 9,
    paddingHorizontal: 9
  },
  placeholder: {
    color: "#fff",
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
