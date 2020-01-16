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
  Dimensions
} from "react-native";

//Expo
import * as Expo from "expo";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { Notifications } from "expo";
import Constants from "expo-constants";

//Redux
import { connect } from "react-redux";
import SetCreateAccountDataAction from "../../../../storage/actions/RegistrationActions/SetCreateAccountDataAction";
import SetGUIDAction from "../../../../storage/actions/RegistrationActions/SetGUIDAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//Icons
import { Icon, Input } from "react-native-elements";
import { Chevron } from "react-native-shapes";

//Shared Components
import FailScreen from "../../Profile_SharedComponents/FailScreen";
import NextButton from "../../Profile_SharedComponents/NextButton";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");
import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage
} from "../../LocalStorage/localStorage.js";

//IP config
import { localhost } from "../../../../config/ipconfig";

//Checker Functions
import {
  emailCheck,
  nullCheck,
  passwordLength,
  passwordCase,
  passwordNonLetter,
  passwordCheck
} from "../Util/RegistrationScreenCheckers.js";

//Warning Texts
import {
  emptyEmailWarning,
  emptyPasswordWarning,
  invalidEmailWarning,
  invalidConfirmEmailWarning,
  invalidPasswordWarning,
  invalidConfirmPasswordWarning,
  duplicateEmailWarning,
  internalErrorWarning
} from "../Util/RegistrationScreenWarnings.js";

//Push Notification Permission
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  global.deviceToken = await Notifications.getExpoPushTokenAsync();
  console.log("Heres your Device ID", global.deviceToken);
  // POST the token to your backend server from where you can retrieve it to send push notifications.
}

//Location Permission
async function registerForLocationAsync() {
  console.log("asking permission");
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== "granted") {
    this.setState({
      errorMessage: "Permission to access location was denied"
    });
  }
  console.log("getting location");
  let location = await Location.getCurrentPositionAsync({});
  global.currentLatLong =
    location.coords.latitude + "," + location.coords.longitude;
  global.currentAltitude = location.coords.altitude;
  console.log("Heres your position", global.currentLatLong);
  console.log("Heres your altitude", global.currentAltitude);
  // POST the token to your backend server from where you can retrieve it to send push notifications.
}

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      confirmEmail: "",
      password: "",
      confrimPassword: "",
      emailWarning: "empty",
      confirmEmailWarning: "empty",
      passwordWarning: "empty",
      confirmPasswordWarning: "empty",
      password_UpperLowerCaseWarning: true,
      password_NumberSymbolWarning: true,
      password_LengthWarning: true,
      passed: false,
      editable: true,
      internalErrorWarning: false,
      isSuccess: true,
      isDelaying: false
    };
    this.isContinueUserFetched = false;
  }

  //Query data from database
  getDataFromDB = async () => {
    await fetch(`http://${localhost}:4000/api/profile/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "createAccount"
      })
    })
      .then(res => res.json())
      .then(async res => {
        let object = JSON.parse(JSON.stringify(res));

        //SUCCESS ON QUERYING DATA
        if (object.success) {
          //setState
          this.setState({
            email: object.result.email,
            confirmEmail: object.result.email,
            password: "Password",
            confirmPassword: "Password",
            emailWarning: "",
            confirmEmailWarning: "",
            passwordWarning: "",
            confirmPasswordWarning: "",
            password_UpperLowerCaseWarning: false,
            password_NumberSymbolWarning: false,
            password_LengthWarning: false,
            isSuccess: true,
            editable: false,
            passed: true
          });

          //LocalStorage
          //Note: only createAccount.js (getDataFromDB()) has checklist
          //Because createAccount.js would always be the first screen display to user
          //On CollapsibleRegistration.js, it will stores the checklist (OAuth query this) into redux
          //and createAccount.js will store this checklist into LocalStorage
          //That begin said, when user reached CollapsibleRegistration.js, a checklist should be exist
          //Other Screens may or maybe not open, so they doesn't need to update the checklist
          //Actually, not even sure does the checklist even need here
          //Because if user resume back to here, that means OAuth must already query all info includes gui, checklist...
          //CollaspibleRegistration.js would use the checklist for setup tabs status
          //Therefore, createAccount.js (getDataFromDB()) don't even need to touch the checklist
          //createAccount.js only update the checklist when submiting
          let json_checklist = JSON.stringify(
            this.props.CreateProfileDataReducer.checklist
          );
          //Only insert or replace id = 1
          let insertSqlStatement =
            "INSERT OR REPLACE into device_user_createAccount(id, guid, email, password, isAdmin, checklist, phoneNumber, deviceID, deviceLatLong, deviceAltitude) " +
            "values(1, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

          let { success } = await insertDataIntoLocalStorage(
            insertSqlStatement,
            "device_user_createAccount",
            [
              object.result._id,
              object.result.email,
              "Password",
              false,
              json_checklist,
              "temp",
              global.deviceToken,
              global.currentLatLong,
              global.currentAltitude
            ],
            true
          );

          if (!success) {
            console.log("failed storing data into localStorage");
            //handle error on inserting data into localStorage
          }

          //Redux
          this.props.SetCreateAccountDataAction({
            email: object.result.email,
            password: "Password"
          });
        } else {
          //INTERNAL ERROR
          //if error on query
          //try lcoalStorage
          //if localStorage works
          //setState
          //if localStorage not works
          //throw err
          throw new Error("internal Error");
        }
      })
      .catch(async err => {
        //HANDLE ANY CATCHED ERRORS
        console.log(`login: ${this.props.CreateProfileDataReducer.guid}`);

        let object = await selectDataFromLocalStorage(
          "device_user_createAccount",
          1
        );

        if (object.success) {
          let { email, guid } = object.result.rows._array[0];
          console.log(`storage${guid}`);

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
            email: email,
            confirmEmail: email,
            password: "Passwords",
            confirmPassword: "Password",
            emailWarning: "",
            confirmEmailWarning: "",
            passwordWarning: "",
            confirmPasswordWarning: "",
            password_UpperLowerCaseWarning: false,
            password_NumberSymbolWarning: false,
            password_LengthWarning: false,
            isSuccess: true,
            editable: false,
            passed: true
            //if user can resume,
            //that means the user had passed createAccount screen
          });

          //Redux
          this.props.SetCreateAccountDataAction({
            email: email,
            password: "Password"
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

  setupThirdPartyServices = () => {
    //setState
    this.setState({
      email: "third party services",
      confirmEmail: "third party services",
      password: "Password",
      confirmPassword: "Password",
      emailWarning: "",
      confirmEmailWarning: "",
      passwordWarning: "",
      confirmPasswordWarning: "",
      password_UpperLowerCaseWarning: false,
      password_NumberSymbolWarning: false,
      password_LengthWarning: false,
      isSuccess: true,
      editable: false,
      passed: true
    });
  };

  async componentDidMount() {
    if (Constants.isDevice) {
      registerForPushNotificationsAsync();
      registerForLocationAsync();
    } else {
      console.log("Your are on a simulator, PUSH NOTIFICATIONS DISABLED");
    }
    //For createAccount only, not allow continue user to edit the createAccount
    if (this.props.CreateProfileDataReducer.isContinueUser) {
      this.setState({
        editable: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)
    if (
      this.state.emailWarning !== prevState.emailWarning ||
      this.state.confirmEmailWarning !== prevState.confirmEmailWarning ||
      this.state.passwordWarning !== prevState.passwordWarning ||
      this.state.confirmPasswordWarning !== prevState.confirmPasswordWarning
    ) {
      this.allChecker();
      //For new user only, if something is modified, remove the check icon
      if (!this.props.CreateProfileDataReducer.isContinueUser) {
        this.props.handlePassed("createAccount", 2);
      }
      //reset internalErrorWarning
    }
    if (
      this.props.createAccountToggle &&
      this.props.CreateProfileDataReducer.isContinueUser
    ) {
      if (!this.isContinueUserFetched) {
        if (this.props.CreateProfileDataReducer.isThirdPartiesServiceUser) {
          console.log("3rd")
          this.setupThirdPartyServices();
        } else {
          console.log("continue")
          this.getDataFromDB();
        }
        this.isContinueUserFetched = true;
      }
    }
  }

  //check email
  emailChecker = () => {
    //Clear confirmEmail Input if any changes made to email input
    this.confirmEmailInput.clear();
    this.setState({
      confirmEmailWarning: "empty"
    });

    if (!nullCheck(this.state.email)) {
      this.setState({
        emailWarning: "empty"
      });
    } else if (!emailCheck(this.state.email)) {
      this.setState({
        emailWarning: "invalid"
      });
    } else {
      this.setState({
        emailWarning: ""
      });
    }
  };

  confirmEmailChecker = () => {
    if (!nullCheck(this.state.confirmEmail)) {
      this.setState({
        confirmEmailWarning: "empty"
      });
    } else if (this.state.email !== this.state.confirmEmail) {
      this.setState({
        confirmEmailWarning: "notmatch"
      });
    } else {
      this.setState({
        confirmEmailWarning: ""
      });
    }
  };

  passwordChecker = () => {
    //Clear password Input if any changes made to password input
    this.confirmPasswordInput.clear();
    this.setState({
      confirmPasswordWarning: "empty"
    });
    if (!nullCheck(this.state.password)) {
      this.setState({
        passwordWarning: "empty",
        password_UpperLowerCaseWarning: true,
        password_NumberSymbolWarning: true,
        password_LengthWarning: true
      });
    } else if (!passwordCheck(this.state.password)) {
      let pLength = !passwordLength(this.state.password);
      let pLetterCase = !passwordCase(this.state.password);
      let pNonLetter = !passwordNonLetter(this.state.password);
      this.setState({
        passwordWarning: "invalid",
        password_UpperLowerCaseWarning: pLetterCase,
        password_NumberSymbolWarning: pNonLetter,
        password_LengthWarning: pLength
      });
    } else {
      this.setState({
        passwordWarning: "",
        password_UpperLowerCaseWarning: false,
        password_NumberSymbolWarning: false,
        password_LengthWarning: false
      });
    }
  };

  confirmPasswordChecker = () => {
    if (!nullCheck(this.state.confirmPassword)) {
      password = false;
      this.setState({
        confirmPasswordWarning: "empty"
      });
    } else if (this.state.password !== this.state.confirmPassword) {
      password = false;
      this.setState({
        confirmPasswordWarning: "notmatch"
      });
    } else {
      password = true;
      this.setState({
        confirmPasswordWarning: ""
      });
    }
  };

  //control next button style and next screen
  allChecker = () => {
    if (
      this.state.emailWarning === "" &&
      this.state.confirmEmailWarning === "" &&
      this.state.passwordWarning === "" &&
      this.state.confirmPasswordWarning === ""
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

  handleSubmit = () => {
    //editable is set to true by default
    if (this.state.editable === false) {
      return this.props.handleToggle("createAccount", null);
    }

    //The only way of make this.state.passed to true; make the next button clickable
    //is to input all the fields,
    if (this.state.passed) {
      let checklist = this.props.CreateProfileDataReducer.checklist;
      //console.log(checklist);
      checklist.createAccount = true;

      //When user submit email/password
      //set editable to true so the user cannot resubmit other email
      //We do not want the user to submit other one (generate a new guid) on the same registration
      //the editable will lock the input to prevent changing email or password
      this.setState(
        {
          editable: false,
          isDelaying: true
        },
        () => {
          //insert a profile into database
          fetch(`http://${localhost}:4000/api/profile/insert`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              collection: "createAccount",
              data: {
                email: this.state.email,
                password: this.state.password,
                isAdmin: false,
                phoneNumber: "",
                deviceID: global.deviceToken,
                deviceLatLong: global.currentLatLong,
                deviceAltitude: global.currentAltitude
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
                this.props.SetCreateAccountDataAction({
                  email: this.state.email,
                  password: this.state.password
                });
                this.props.SetGUIDAction({
                  guid: object.guid
                });
                this.props.SetChecklistAction({
                  checklist: checklist
                });

                //LocalStorage
                json_checklist = JSON.stringify(checklist);

                //Only insert or replace id = 1
                let insertSqlStatement =
                  "INSERT OR REPLACE into device_user_createAccount(id, guid, email, password, isAdmin, checklist, phoneNumber, deviceID, deviceLatLong, deviceAltitude) " +
                  "values(1, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

                let { success } = await insertDataIntoLocalStorage(
                  insertSqlStatement,
                  "device_user_createAccount",
                  [
                    object.guid,
                    this.state.email,
                    this.state.password,
                    false,
                    json_checklist,
                    "temp",
                    global.deviceToken,
                    global.currentLatLong,
                    global.currentAltitude
                  ],
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
                    //it will put a check mark for createAccount screen
                    this.props.handlePassed("createAccount", 1);
                  }
                );
              } else if (object.success === false && object.status === 409) {
                //DUPLICATE EMAIL

                //setState
                this.setState(
                  {
                    emailWarning: "duplicate",
                    editable: true,
                    internalErrorWarning: false,
                    isDelaying: false
                  },
                  () => {
                    //put a error marker for createAccount
                    this.props.handlePassed("createAccount", 3);
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
                  editable: true,
                  internalErrorWarning: true,
                  isDelaying: false
                },
                () => {
                  //put a error marker for createAccount
                  this.props.handlePassed("createAccount", 3);
                }
              );
            });
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
        <View style={styles.space} />

        {/**email */}
        <View style={{ width: "100%" }}>
          <Input
            placeholder="email"
            placeholderTextColor="#6a0dad"
            inputStyle={styles.inputStyle}
            value={this.state.email}
            returnKeyType="done"
            rightIcon={
              this.state.emailWarning === "" ? (
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
            editable={this.state.editable}
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email =>
              this.setState({ email }, () => {
                this.emailChecker();
              })
            }
          />
          {this.state.emailWarning === "empty" && emptyEmailWarning}
          {this.state.emailWarning === "invalid" && invalidEmailWarning}
          {this.state.emailWarning === "duplicate" && duplicateEmailWarning}
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

        {/**confirm email*/}
        <View>
          <Input
            placeholder="confirm email"
            placeholderTextColor="#6a0dad"
            inputStyle={styles.inputStyle}
            value={this.state.confirmEmail}
            returnKeyType="done"
            rightIcon={
              this.state.confirmEmailWarning === "" ? (
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
            editable={this.state.editable}
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            ref={input => {
              this.confirmEmailInput = input;
            }}
            onChangeText={confirmEmail =>
              this.setState({ confirmEmail }, () => {
                this.confirmEmailChecker();
              })
            }
          />
          {this.state.confirmEmailWarning === "empty" && emptyEmailWarning}
          {this.state.confirmEmailWarning === "notmatch" &&
            invalidConfirmEmailWarning}
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

        {/**password*/}
        <View>
          <Input
            placeholder="password"
            placeholderTextColor="#6a0dad"
            inputStyle={styles.inputStyle}
            value={this.state.password}
            returnKeyType="done"
            rightIcon={
              this.state.passwordWarning === "" ? (
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
            editable={this.state.editable}
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={password =>
              this.setState({ password }, () => {
                this.passwordChecker();
              })
            }
          />
          {this.state.passwordWarning === "empty" && emptyPasswordWarning}
          {this.state.passwordWarning === "invalid" && invalidPasswordWarning}
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

        {/**confirm password*/}
        <View>
          <Input
            placeholder="confirmPassword"
            placeholderTextColor="#6a0dad"
            inputStyle={styles.inputStyle}
            value={this.state.confirmPassword}
            returnKeyType="done"
            rightIcon={
              this.state.confirmPasswordWarning === "" ? (
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
            editable={this.state.editable}
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            ref={input => {
              this.confirmPasswordInput = input;
            }}
            onChangeText={confirmPassword =>
              this.setState({ confirmPassword }, () => {
                this.confirmPasswordChecker();
              })
            }
          />
          {this.state.confirmPasswordWarning === "empty" &&
            emptyPasswordWarning}
          {this.state.confirmPasswordWarning === "notmatch" &&
            invalidConfirmPasswordWarning}
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

        {/*Password Hints Box*/}
        <View style={styles.passwordHintWrap}>
          {/*Password Hints Text*/}
          <View style={styles.passwordHintTextWrap}>
            {this.state.password_UpperLowerCaseWarning ? (
              <Icon name="times" type="font-awesome" color="red" />
            ) : (
              <Icon name="check" type="font-awesome" color="#6a0dad" />
            )}
            <Text style={styles.passwordHintText}>
              {"   "}
              include upper and lower case
            </Text>
          </View>

          {/*Password Hints Text*/}
          <View style={styles.passwordHintTextWrap}>
            {this.state.password_NumberSymbolWarning ? (
              <Icon name="times" type="font-awesome" color="red" />
            ) : (
              <Icon name="check" type="font-awesome" color="#6a0dad" />
            )}
            <Text style={styles.passwordHintText}>
              {"   "}
              include at least a number or symbol
            </Text>
          </View>

          {/*Password Hints Text*/}
          <View style={styles.passwordHintTextWrap}>
            {this.state.password_LengthWarning ? (
              <Icon name="times" type="font-awesome" color="red" />
            ) : (
              <Icon name="check" type="font-awesome" color="#6a0dad" />
            )}
            <Text style={styles.passwordHintText}>
              {"   "}
              be at least 8 characters long
            </Text>
          </View>
        </View>
        {/*Spaces*/}
        <View style={styles.space} />

        {/*Next Button*/}
        <NextButton
          passed={this.state.passed}
          handleSubmit={this.handleSubmit}
          isDelaying={this.state.isDelaying}
        />

        {/*Spaces*/}
        <View style={styles.space} />
      </View>
    );
  };

  failScreen = () => {
    //For isContinueUser Only
    //If fail on fetching, then display a screen to tell them try again
    return <FailScreen getDataFunction={this.getDataFromDB} />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.failScreen();
  }
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  input: {
    height: 40,
    borderColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  inputStyle: {
    color: "#6a0dad",
    fontSize: Math.round(width / 28.84)
  },
  passwordHintTextWrap: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  passwordHintText: {
    color: "#6a0dad",
    paddingVertical: 5,
    fontSize: Math.round(width / 26.78)
  },
  passwordHintWrap: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#6a0dad",
    padding: "3%"
  },
  space: {
    padding: "3%"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetCreateAccountDataAction: payload =>
      dispatch(SetCreateAccountDataAction(payload)),
    SetGUIDAction: payload => dispatch(SetGUIDAction(payload)),
    SetChecklistAction: payload => dispatch(SetChecklistAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);
