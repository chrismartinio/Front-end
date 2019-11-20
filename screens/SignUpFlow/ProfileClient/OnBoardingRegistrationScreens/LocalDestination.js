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

//data
import { locations } from "../Data/Locations.js";

//Collapsible Components
import FailScreen from "../Components/FailScreen";
import NextButton from "../Components/NextButton";

//checker functions
import { locationsChecker } from "../Util/OnBoardingRegistrationScreenCheckers.js";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");

//warnings
import {
  internalErrorWarning,
  emptyCityWarning
} from "../Util/OnBoardingRegistrationScreenWarnings.js";

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

    await fetch("http://10.0.0.119:4000/api/profile/query", {
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
      .then(res => {
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
            "INSERT OR REPLACE into device_user_localDestination(id, createAccount_id, localDestination) " +
            "values(1, 1, ?);";

          db.transaction(
            tx => {
              //INSERT DATA
              tx.executeSql(
                insertSqlStatement,
                [object.result.localDestination],
                (tx, result) => {
                  console.log("inner success");
                },
                (tx, err) => {
                  console.log("inner error: ", err);
                }
              );
              //DISPLAY DATA
              tx.executeSql(
                "select * from device_user_localDestination",
                null,
                (tx, result) => {
                  console.log(result);
                },
                (tx, err) => {
                  console.log("inner error: ", err);
                }
              );
            },
            (tx, err) => {
              console.log(err);
            },
            () => {
              console.log("outer success");
            }
          );

          //Redux
          this.props.SetLocalDestinationDataAction({
            localDestination: object.result.localDestination
          });
        } else {
          //INTERNAL ERROR
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //HANDLE ANY CATCHED ERRORS
        this.getDataFromLocalStorage()
          .then(result => {
            let { localDestination } = result.rows._array[0];
            //setState
            this.setState({
              localDestination: localDestination,
              isSuccess: true
            });
          })
          .catch(err => {
            //If error while fetching, direct user to failScreen
            //setState
            this.setState({
              isSuccess: false
            });
          });
      });
  };

  getDataFromLocalStorage = () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          //DISPLAY DATA
          tx.executeSql(
            "select * from device_user_localDestination",
            null,
            (tx, result) => {
              if (result.rows.length <= 0) reject(new Error("Internal Error"));
              resolve(result);
            },
            (tx, err) => {
              reject(err);
            }
          );
        },
        (tx, err) => {
          reject(err);
        },
        () => {
          console.log("outer success");
        }
      );
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

  changeColor = bname => {
    let topY = this.props.scrollY;
    let otherScreenOffset1 = 0,
      otherScreenOffset2 = 0,
      otherScreenOffset3 = 0,
      speedOfYChange = 1.2;

    this.props.otherToggle.forEach((toggle, i = 0) => {
      if (toggle) {
        if (i === 2) {
          otherScreenOffset1 += 41;
          otherScreenOffset2 += 161;
          otherScreenOffset3 += 100;
        } else if (i === 3) {
          otherScreenOffset1 += 28;
          otherScreenOffset2 += 113;
          otherScreenOffset3 += 68;
        } else {
          otherScreenOffset1 += 30.5;
          otherScreenOffset2 += 106;
          otherScreenOffset3 += 64;
        }
      }
      i++;
    });

    const topRed = 24;
    const topGreen = 205;
    const topBlue = 246;

    const bottomRed = 67;
    const bottomGreen = 33;
    const bottomBlue = 140;

    let pos = (this[bname] - topY) / screenHeight;

    let colorRed =
      (topRed + (bottomRed - topRed) * pos) * speedOfYChange +
      51 +
      otherScreenOffset1;
    let colorGreen =
      (topGreen + (bottomGreen - topGreen) * pos) * speedOfYChange -
      263 -
      otherScreenOffset2;
    let colorBlue =
      (topBlue + (bottomBlue - topBlue) * pos) * speedOfYChange -
      186 -
      otherScreenOffset3;

    //default
    colorRed = 67;
    colorGreen = 33;
    colorBlue = 140;

    return `rgb(${colorRed},${colorGreen},${colorBlue})`;
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
          fetch("http://10.0.0.119:4000/api/profile/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              guid: this.props.CreateProfileDataReducer.guid,
              collection: "localDestination",
              data: {
                localDestination: this.state.localDestination,
                checklist: checklist
              }
            })
          })
            .then(res => res.json())
            .then(res => {
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
                  "INSERT OR REPLACE into device_user_localDestination(id, createAccount_id, localDestination) " +
                  "values(1, 1, ?);";

                db.transaction(
                  tx => {
                    //INSERT DATA
                    tx.executeSql(
                      insertSqlStatement,
                      [this.state.localDestination],
                      (tx, result) => {
                        console.log("inner success");
                      },
                      (tx, err) => {
                        console.log("inner error: ", err);
                      }
                    );
                    //UPDATE CHECKLIST
                    tx.executeSql(
                      "UPDATE device_user_createAccount SET checklist = ? WHERE id = 1;",
                      [json_checklist],
                      (tx, result) => {
                        console.log("inner success");
                      },
                      (tx, err) => {
                        console.log("inner error: ", err);
                      }
                    );
                    //DISPLAY DATA
                    tx.executeSql(
                      "select * from device_user_localDestination",
                      null,
                      (tx, result) => {
                        console.log(result);
                      },
                      (tx, err) => {
                        console.log("inner error: ", err);
                      }
                    );
                  },
                  (tx, err) => {
                    console.log(err);
                  },
                  () => {
                    console.log("outer success");
                  }
                );

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
                  this.state.localDestination !== e ? "transparent" : "white",
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
                      ? "white"
                      : this.changeColor(`b${index}y`)
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
    color: "#fff",
    fontSize: 20
  },
  locationsButtonWrap: {
    alignItems: "center",
    padding: width / 37.5,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
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
  spendAWeekendText: { color: "white", fontSize: 24 },
  pick1Text: { opacity: 0.7, color: "white" }
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
