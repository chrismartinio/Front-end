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
  Picker,
  TextInput,
  Dimensions,
  ActivityIndicator
} from "react-native";

//Redux
import { connect } from "react-redux";
import SetLocalDestinationDataAction from "../../../../storage/actions/RegistrationActions/SetLocalDestinationDataAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//Icons
import { Icon } from "react-native-elements";

//ScrollView
const screenHeight = Math.round(Dimensions.get("window").height);

//Data
import { locations } from "../Data/Locations.js";

//Shared Components
import FailScreen from "../../Profile_SharedComponents/FailScreen";
import NextButton from "../../Profile_SharedComponents/NextButton";

//Checker Function
import { locationsChecker } from "../Util/RegistrationScreenCheckers.js";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");
import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage
} from "../../LocalStorage/localStorage.js";

//IP config
import { server_profile } from "../../../../config/ipconfig";

//Warning Texts
import {
  internalErrorWarning,
  emptyCityWarning
} from "../Util/RegistrationScreenWarnings.js";

class LocationDestinations extends Component {
  //having null header means no back  button is present!
  constructor(props) {
    super(props);
    this.state = {
      localDestination: "",
      passed: false,
      internalErrorWarning: false,
      isSuccess: true
    };

    this.isContinueUserFetched = false;
  }

  getDataFromDB = async () => {
    //if checklist says this screen is not complete, return (don't do query)
    if (!this.props.CreateProfileDataReducer.checklist.localDestination) {
      return;
    }

    await fetch(`${server_profile}/api/profile/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "localDestination"
      })
    })
      .then(res => res.json())
      .then(async res => {
        let object = JSON.parse(JSON.stringify(res));
        //console.log(object);
        //SUCCESS ON QUERYING DATA
        if (object.success) {
          //setState
          this.setState({
            localDestination: object.result.localDestination,
            isSuccess: true
          });

          //LocalStorage
          //Only insert or replace id = 1
          let insertSqlStatement =
            "INSERT OR REPLACE into device_user_localDestination(id, createAccount_id, localDestination, guid) " +
            "values(1, 1, ?, ?);";

          let { success } = await insertDataIntoLocalStorage(
            insertSqlStatement,
            "device_user_localDestination",
            [
              object.result.localDestination,
              this.props.CreateProfileDataReducer.guid
            ],
            true
          );

          if (!success) {
            console.log("failed storing data into localStorage");
            //handle error on inserting data into localStorage
          }

          //Redux
          this.props.SetLocalDestinationDataAction({
            localDestination: object.result.localDestination
          });
        } else {
          //INTERNAL ERROR
          throw new Error("internal Error");
        }
      })
      .catch(async err => {
        //HANDLE ANY CATCHED ERRORS
        let object = await selectDataFromLocalStorage(
          "device_user_localDestination",
          1
        );

        if (object.success) {
          let { localDestination, guid } = object.result.rows._array[0];
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
            localDestination: localDestination,
            isSuccess: true
          });

          //Redux
          this.props.SetLocalDestinationDataAction({
            localDestination: localDestination
          });
        } else {
          //If error while fetching, direct user to failScreen
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

  //header : navigate to sign in screen
  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)

    if (prevState.localDestination !== this.state.localDestination) {
      this.allChecker();
      //any changes will remove the check mark from CollapsibleComponent CheckMark
      //For new user only, if something is modified, remove the check icon
      if (!this.props.CreateProfileDataReducer.isContinueUser) {
        this.props.handlePassed("localDestination", 2);
      }
    }

    if (
      prevProps.localDestinationToggle !== this.props.localDestinationToggle
    ) {
      if (
        this.props.localDestinationToggle &&
        this.props.CreateProfileDataReducer.isContinueUser
      ) {
        if (!this.isContinueUserFetched) {
          this.getDataFromDB();
          this.isContinueUserFetched = true;
        }
      }
    }
  }

  handlPress = location => {
    if (this.state.localDestination === location) {
      this.setState({
        localDestination: ""
      });
    } else {
      this.setState({
        localDestination: location
      });
    }
  };

  allChecker = () => {
    if (locationsChecker(this.state.localDestination)) {
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
    //if the screen passed and guid is not null (that means user had finished createAccount)
    if (
      this.state.passed &&
      this.props.CreateProfileDataReducer.guid !== null
    ) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      checklist.localDestination = true;

      this.setState(
        {
          isDelaying: true
        },
        () => {
          //Send data to database
          fetch(`${server_profile}/api/profile/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              guid: this.props.CreateProfileDataReducer.guid,
              collection: "localDestination",
              data: {
                localDestination: this.state.localDestination,
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
                this.props.SetLocalDestinationDataAction({
                  localDestination: this.state.localDestination
                });
                this.props.SetChecklistAction({
                  checklist: checklist
                });

                //LocalStorage
                let json_checklist = JSON.stringify(checklist);
                //Only insert or replace id = 1
                let insertSqlStatement =
                  "INSERT OR REPLACE into device_user_localDestination(id, createAccount_id, localDestination, guid) " +
                  "values(1, 1, ?, ?);";

                let { success } = await insertDataIntoLocalStorage(
                  insertSqlStatement,
                  "device_user_localDestination",
                  [
                    this.state.localDestination,
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
                    //it will put a check mark for LocationDestination
                    this.props.handlePassed("localDestination", 1);
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
                  //put a error marker for localDestination
                  this.props.handlePassed("localDestination", 3);
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
          this.props.handlePassed("localDestination", 3);
        }
      );
    }
  };

  successScreen = () => {
    let displayLocation = locations.map((e, index = 0) => {
      return (
        <View
          key={index++}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            //this[`b${index}y`] =
            //layout.y + this.props.localDestinationPositionY;
            this[`b${index}y`] = layout.y;
          }}
        >
          <TouchableOpacity
            style={[
              styles.locationsButtonWrap,
              {
                backgroundColor:
                  this.state.localDestination !== e
                    ? "#fff"
                    : "rgb(67, 33, 140)",
                minWidth:
                  e === "San Francisco" || e === "Morro Bay" ? "50%" : "45%"
              }
            ]}
            onPress={() => this.handlPress(e)}
          >
            <Text
              style={[
                styles.locationsButton,
                {
                  color:
                    this.state.localDestination !== e
                      ? "rgb(67, 33, 140)"
                      : "#fff"
                }
              ]}
            >
              {e}
            </Text>
          </TouchableOpacity>
        </View>
      );
    });
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
          <Text style={styles.spendAWeekendText}>Spend a weekend</Text>
          <Text />
          <Text style={styles.pick1Text}>Pick 1</Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "5%"
            }}
          />
        </View>

        {/*likes*/}
        <View style={styles.locationsWrapCenter}>
          <View style={styles.locationsWrap}>{displayLocation}</View>
        </View>
        <Text />
        {this.state.localDestination === "" && emptyCityWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "10%"
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
  locationsButton: {
    color: "rgb(67, 33, 140)",
    fontSize: 20
  },
  locationsButtonWrap: {
    alignItems: "center",
    padding: width / 37.5,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgb(67, 33, 140)",
    width: "auto",
    minWidth: "45%",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10
  },
  locationsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  locationsWrapCenter: {
    alignItems: "center"
    //marginTop: "15%"
  },
  spendAWeekendText: { color: "rgb(67, 33, 140)", fontSize: 24 },
  pick1Text: { opacity: 0.7, color: "rgb(67, 33, 140)" }
});

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  SetLocalDestinationDataAction: payload =>
    dispatch(SetLocalDestinationDataAction(payload)),
  SetChecklistAction: payload => dispatch(SetChecklistAction(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationDestinations);
