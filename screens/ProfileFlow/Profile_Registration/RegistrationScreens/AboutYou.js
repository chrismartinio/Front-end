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
  ActivityIndicator,
  Dimensions,
  Platform
} from "react-native";

//Redux
import { connect } from "react-redux";
import SetAboutYouDataAction from "../../../../storage/actions/RegistrationActions/SetAboutYouDataAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//Pickers
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";

//Data
import { countries, genders } from "../Data/CountriesAndGenders.js";

//Icons
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

//Shared Components
import FailScreen from "../../Profile_SharedComponents/FailScreen";
import NextButton from "../../Profile_SharedComponents/NextButton";

import { Appearance } from "react-native-appearance";
const colorScheme = Appearance.getColorScheme();
let bgColor;
if (colorScheme === "dark") {
  bgColor = "#000";
} else {
  bgColor = "#fff";
}

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");
import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage
} from "../../LocalStorage/localStorage.js";

//IP config
import { server_profile } from "../../../../config/ipconfig";

//Checkers Functions
import {
  checkZipCode,
  checkName,
  maxDate,
  minDate,
  checkage
} from "../Util/RegistrationScreenCheckers.js";

//Warnings Texts
import {
  invalidFirstNameWarning,
  invalidLastNameWarning,
  invalidBirthDateWarning,
  invalidGenderWarning,
  invalidCountryWarning,
  invalidZipCodeWarning,
  emptyWarning,
  internalErrorWarning
} from "../Util/RegistrationScreenWarnings.js";

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
      isDelaying: false,
      userBio: ""
    };
    this.isContinueUserFetched = false;
  }

  //QUERY DATA FROM DB
  getDataFromDB = async () => {
    if (!this.props.CreateProfileDataReducer.checklist.aboutYou) {
      return;
    }
    //pass in isThirdParty
    await fetch(`${server_profile}/api/profile/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "aboutYou"
      })
    })
      .then(res => res.json())
      .then(async res => {
        let object = JSON.parse(JSON.stringify(res));

        //SUCCESS ON QUERYING DATA
        if (object.success) {
          let {
            firstName,
            lastName,
            birthDate,
            gender,
            country,
            zipCode,
            userBio,
            city,
            state
          } = object.result;

          //setState
          this.setState({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            country: country,
            zipCode: zipCode,
            userBio: userBio,
            firstNameWarning: firstName === "" ? "empty" : "",
            lastNameWarning: lastName === "" ? "empty" : "",
            birthDateWarning: birthDate === "" ? "empty" : "",
            genderWarning: gender === "" ? "empty" : "",
            countryWarning: country === "" ? "empty" : "",
            zipCodeWarning: zipCode === "" ? "empty" : "",
            isSuccess: true
          });

          //LocalStorage
          //Only insert or replace id = 1
          let insertSqlStatement =
            "INSERT OR REPLACE into device_user_aboutYou(id, createAccount_id, firstName, lastName, birthDate, gender, country, zipCode, userBio, city, state, guid) " +
            "values(1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

          let { success } = await insertDataIntoLocalStorage(
            insertSqlStatement,
            "device_user_aboutYou",
            [
              firstName,
              lastName,
              birthDate,
              gender,
              country,
              zipCode,
              userBio,
              city,
              state,
              this.props.CreateProfileDataReducer.guid
            ],
            true
          );

          if (!success) {
            console.log("failed storing data into localStorage");
            //handle error on inserting data into localStorage
          }

          //Redux
          this.props.SetAboutYouDataAction({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            country: country,
            zipCode: zipCode,
            userBio: userBio,
            city: city,
            state: state
          });
        } else {
          //INTERNAL ERROR
          throw new Error("internal Error");
        }
      })
      .catch(async err => {
        //HANDLE ANY CATCHED ERRORS

        let object = await selectDataFromLocalStorage(
          "device_user_aboutYou",
          1
        );

        if (object.success) {
          let {
            firstName,
            lastName,
            birthDate,
            gender,
            country,
            zipCode,
            userBio,
            city,
            state,
            guid
          } = object.result.rows._array[0];

          //if there is already a localstroage guid
          //and if that guid doesn't match the guid that is inside redux guid
          //then set the scree to false
          if (guid !== this.props.CreateProfileDataReducer.guid) {
            return this.setState({
              isSuccess: false
            });
          }

          //setState
          this.setState({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            country: country,
            zipCode: zipCode,
            userBio: userBio,
            firstNameWarning: firstName === "" ? "empty" : "",
            lastNameWarning: lastName === "" ? "empty" : "",
            birthDateWarning: birthDate === "" ? "empty" : "",
            genderWarning: gender === "" ? "empty" : "",
            countryWarning: country === "" ? "empty" : "",
            zipCodeWarning: zipCode === "" ? "empty" : "",
            isSuccess: true
          });

          //Redux
          this.props.SetAboutYouDataAction({
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            country: country,
            zipCode: zipCode,
            userBio: userBio,
            city: city,
            state: state
          });
        } else {
          //If error while querying from database,
          //direct user to failScreen

          //setState
          this.setState({
            isSuccess: false
          });
        }
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
          this.getDataFromDB();
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
    //if the screen passed and guid is not null (that means user had finished createAccount)
    if (
      this.state.passed &&
      this.props.CreateProfileDataReducer.guid !== null
    ) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      //console.log(checklist);
      checklist.aboutYou = true;

      this.setState(
        {
          isDelaying: true
        },
        () => {
          fetch(`${server_profile}/api/profile/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              guid: this.props.CreateProfileDataReducer.guid,
              collection: "aboutYou",
              data: {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                birthDate: this.state.birthDate,
                gender: this.state.gender,
                country: this.state.country,
                zipCode: this.state.zipCode,
                userBio: this.state.userBio,
                checklist: checklist,
                isThirdPartiesServiceUser: this.props.CreateProfileDataReducer
                  .isThirdPartiesServiceUser
              }
            })
          })
            .then(res => res.json())
            .then(async res => {
              let object = JSON.parse(JSON.stringify(res));
              //console.log(object);
              //SUCCESS ON SUBMITTING DATA
              if (object.success) {
                //Redux
                this.props.SetAboutYouDataAction({
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  birthDate: this.state.birthDate,
                  gender: this.state.gender,
                  country: this.state.country,
                  zipCode: this.state.zipCode,
                  userBio: this.state.userBio
                });
                this.props.SetChecklistAction({
                  checklist: checklist
                });

                //LocalStorage
                let json_checklist = JSON.stringify(checklist);
                //Only insert or replace id = 1
                let insertSqlStatement =
                  "INSERT OR REPLACE into device_user_aboutYou(id, createAccount_id, firstName, lastName, birthDate, gender, country, zipCode, userBio, city, state, guid) " +
                  "values(1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

                let { success } = await insertDataIntoLocalStorage(
                  insertSqlStatement,
                  "device_user_aboutYou",
                  [
                    this.state.firstName,
                    this.state.lastName,
                    this.state.birthDate,
                    this.state.gender,
                    this.state.country,
                    this.state.zipCode,
                    this.state.userBio,
                    "",
                    "",
                    this.props.CreateProfileDataReducer.guid
                  ],
                  true
                );

                if (!success) {
                  console.log("failed storing data into localStorage");
                  //handle error on inserting data into localStorage
                }

                //update checklist
                let updateSqlStatement =
                  "UPDATE device_user_createAccount SET checklist = ? WHERE id = 1;";
                success = await insertDataIntoLocalStorage(
                  updateSqlStatement,
                  "device_user_createAccount",
                  [json_checklist],
                  true
                );

                if (!success) {
                  console.log("failed storing data into localStorage");
                  //handle error on inserting data into localStorage
                }

                //setState
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
              } else if (object.success === false && object.status === 422) {
                //Invalid ZipCode

                //setState
                this.setState(
                  {
                    zipCodeWarning: "invalid",
                    internalErrorWarning: false,
                    isDelaying: false
                  },
                  () => {
                    //put a error marker for aboutYou
                    this.props.handlePassed("aboutYou", 3);
                  }
                );
              } else {
                //INTERNAL ERROR
                throw new Error("Internal Error ");
              }
            })
            .catch(error => {
              //HANDLE ANY CATCHED ERRORS
              //setState
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
      //if guid is null

      //User must has a guid retrieve from the createAccount screen before get to this screen
      //if there are no guid, give an error warning
      //the reason of no guid may come from internal error when inserting email/password into createAccount Collection
      //and error had thrown and guid didn't return back to client
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
        {/*Internal Error Warning*/}
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
            placeholderTextColor="#6a0dad"
            inputStyle={styles.inputStyle}
            value={this.state.firstName}
            returnKeyType="done"
            rightIcon={
              this.state.firstNameWarning === "" ? (
                <Icon
                  type="font-awesome"
                  name="check"
                  color="#6a0dad"
                />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#6a0dad"
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
            placeholderTextColor="#6a0dad"
            inputStyle={styles.inputStyle}
            value={this.state.lastName}
            returnKeyType="done"
            rightIcon={
              this.state.lastNameWarning === "" ? (
                <Icon
                  type="font-awesome"
                  name="check"
                  color="#6a0dad"
                />
              ) : (
                <Icon
                  type="font-awesome"
                  name="exclamation-circle"
                  color="#6a0dad"
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
                    color="#6a0dad"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="#6a0dad"
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
              useNativeAndroidPickerStyle={false}
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
                    color="#6a0dad"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="#6a0dad"
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

        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
          }}
        />

        {/**Country and ZipCode Wrap */}
        <View style={styles.countryAndZipCodeWrap}>
          {/**country */}
          <View style={styles.countryPickerWrap}>
            <RNPickerSelect
              style={countryPicker}
              useNativeAndroidPickerStyle={false}
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
                    color="#6a0dad"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="#6a0dad"
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

          {/**zipcode*/}
          <View style={styles.zipCodeInputWrap}>
            <Input
              placeholder="zip code"
              placeholderTextColor="#6a0dad"
              inputStyle={styles.inputStyle}
              autoCompleteType={"off"}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              maxLength={5}
              returnKeyType="done"
              value={this.state.zipCode}
              rightIcon={
                this.state.zipCodeWarning === "" ? (
                  <Icon
                    type="font-awesome"
                    name="check"
                    color="#6a0dad"
                  />
                ) : (
                  <Icon
                    type="font-awesome"
                    name="exclamation-circle"
                    color="#6a0dad"
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
            padding: "7%"
          }}
        />

        {/*User Bio*/}
        <View style={styles.userBioWrap}>
          <TextInput
            style={styles.userBioInputStyle}
            placeholder="Tell us about yourself"
            placeholderTextColor="#6a0dad"
            multiline={true}
            numberOfLines={4}
            value={this.state.userBio}
            returnKeyType="done"
            onChangeText={userBio => this.setState({ userBio })}
          />
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

        {/*Next Button*/}
        <NextButton
          passed={this.state.passed}
          handleSubmit={this.handleSubmit}
          isDelaying={this.state.isDelaying}
        />

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
    return (
      <FailScreen getDataFunction={this.getDataFromDB} reset={this.reset} />
    );
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.failScreen();
  }
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputStyle: {
    color: "#6a0dad",
    fontSize: Math.round(width / 28.84)
  },
  birthdatePicker: {
    width: "45%",
    color: "#6a0dad",
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
  userBioWrap: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6a0dad",
    height: 100
  },
  userBioInputStyle: {
    color: "#6a0dad",
    fontSize: Math.round(width / 28.84),
    paddingHorizontal: 15,
    paddingVertical: 15
  }
});

const genderPicker = {
  inputIOS: {
    color: "#6a0dad",
    borderBottomWidth: 1,
    borderColor: "#6a0dad",
    fontSize: Math.round(width / 28.84),
    paddingVertical: 11.5,
    paddingHorizontal: 9
  },
  inputAndroid: {
    color: "#6a0dad",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderBottomWidth: 1.5,
    borderColor: "#6a0dad",
    fontSize: Math.round(width / 28.84),
    borderRadius: 8
  },
  placeholder: {
    color: "#6a0dad",
    paddingVertical: Platform.OS === "ios" ? 11.5 : 5
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
    borderColor: "#6a0dad"
  },
  dateText: {
    color: "#6a0dad",
    fontSize: Math.round(width / 37.5),
    position: "absolute",
    left: "0%",
    paddingHorizontal: 9
  },
  placeholderText: {
    color: "#6a0dad",
    fontSize: Math.round(width / 28.84),
    position: "absolute",
    left: "0%",
    paddingHorizontal: 9
  },
  datePicker: {
    backgroundColor: bgColor
  }
};

const countryPicker = {
  inputIOS: {
    width: "90%",
    color: "#6a0dad",
    borderBottomWidth: 1,
    borderColor: "#6a0dad",
    fontSize: Math.round(width / 28.84),
    paddingVertical: 9,
    paddingHorizontal: 9
  },
  inputAndroid: {
    width: "95%",
    color: "#6a0dad",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderBottomWidth: 1.5,
    fontSize: Math.round(width / 28.84),
    borderColor: "#6a0dad",
    borderRadius: 8
  },
  placeholder: {
    color: "#6a0dad",
    paddingVertical: Platform.OS === "ios" ? 9 : 3
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
