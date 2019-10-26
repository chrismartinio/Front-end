import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

//Redux
import { connect } from "react-redux";
import SetWouldYouRatherDataAction from "../../../../storage/actions/RegistrationActions/SetWouldYouRatherDataAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//component
import Slider from "../Components/Sliders/WouldYouRatherSlider";

//Collapsible Components
import FailScreen from "../Components/FailScreen";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");

//warnings
import { internalErrorWarning } from "../Util/OnBoardingRegistrationScreenWarnings.js";

class WouldYouRather extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      displaySlider1Value: 0,
      displaySlider2Value: 0,
      displaySlider3Value: 0,
      passed: true,
      internalErrorWarning: false,
      isSuccess: true,
      isDelaying: false
    };
    this.s1r1 = 50;
    this.s1r2 = 50;
    this.s2r1 = 50;
    this.s2r2 = 50;
    this.s3r1 = 50;
    this.s3r2 = 50;

    this.isContinueUserFetched = false;
  }

  getDataFromDB = async () => {
    //if checklist says this screen is not complete, return (don't do query)
    if (!this.props.CreateProfileDataReducer.checklist.wouldYouRather) {
      return;
    }

    await fetch("http://74.80.250.210:4000/api/profile/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "wouldYouRather"
      })
    })
      .then(res => res.json())
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        //console.log(object);
        //SUCCESS ON QUERYING DATA
        if (object.success) {
          //set this
          this.s1r1 = object.result.s1r1;
          this.s1r2 = object.result.s1r2;
          this.s2r1 = object.result.s2r1;
          this.s2r2 = object.result.s2r2;
          this.s3r1 = object.result.s3r1;
          this.s3r2 = object.result.s3r2;
          //setState
          this.setState({
            displaySlider1Value: object.result.s1r2 - 50,
            displaySlider2Value: object.result.s2r2 - 50,
            displaySlider3Value: object.result.s3r2 - 50,
            isSuccess: true
          });

          //LocalStorage
          //Only insert or replace id = 1
          let insertSqlStatement =
            "INSERT OR REPLACE into device_user_wouldYouRather(id, createAccount_id, s1r1, s1r2, s2r1, s2r2, s3r1, s3r2) " +
            "values(1, 1, ?, ?, ?, ?, ?, ?);";

          db.transaction(
            tx => {
              //INSERT DATA
              tx.executeSql(
                insertSqlStatement,
                [
                  object.result.s1r1,
                  object.result.s1r2,
                  object.result.s2r1,
                  object.result.s2r2,
                  object.result.s3r1,
                  object.result.s3r2
                ],
                (tx, result) => {
                  console.log("inner success");
                },
                (tx, err) => {
                  console.log("inner error: ", err);
                }
              );
              //DISPLAY DATA
              tx.executeSql(
                "select * from device_user_wouldYouRather",
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
          this.props.SetWouldYouRatherDataAction({
            s1r1: object.result.s1r1,
            s1r2: object.result.s1r2,
            s2r1: object.result.s2r1,
            s2r2: object.result.s2r2,
            s3r1: object.result.s3r1,
            s3r2: object.result.s3r2
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
            let { s1r1, s1r2, s2r1, s2r2, s3r1, s3r2 } = result.rows._array[0];
            //set this
            this.s1r1 = s1r1;
            this.s1r2 = s1r2;
            this.s2r1 = s2r1;
            this.s2r2 = s2r2;
            this.s3r1 = s3r1;
            this.s3r2 = s3r2;
            //setState
            this.setState({
              displaySlider1Value: s1r2 - 50,
              displaySlider2Value: s2r2 - 50,
              displaySlider3Value: s3r2 - 50,
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
            "select * from device_user_wouldYouRather",
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.wouldYouRatherToggle !== this.props.wouldYouRatherToggle) {
      if (
        this.props.wouldYouRatherToggle &&
        this.props.CreateProfileDataReducer.isContinueUser
      ) {
        if (!this.isContinueUserFetched) {
          this.getDataFromDB();
          this.isContinueUserFetched = true;
        }
      }
    }
  }

  handleSubmit = () => {
    //if the screen passed and guid is not null (that means user had finished createAccount)
    if (this.props.CreateProfileDataReducer.guid !== null) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      checklist.wouldYouRather = true;

      this.setState(
        {
          isDelaying: true
        },
        () => {
          //Send data to database
          fetch("http://74.80.250.210:4000/api/profile/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              guid: this.props.CreateProfileDataReducer.guid,
              collection: "wouldYouRather",
              data: {
                s1r1: this.s1r1,
                s1r2: this.s1r2,
                s2r1: this.s2r1,
                s2r2: this.s2r2,
                s3r1: this.s3r1,
                s3r2: this.s3r2,
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
                this.props.SetWouldYouRatherDataAction({
                  s1r1: this.s1r1,
                  s1r2: this.s1r2,
                  s2r1: this.s2r1,
                  s2r2: this.s2r2,
                  s3r1: this.s3r1,
                  s3r2: this.s3r2
                });
                this.props.SetChecklistAction({
                  checklist: checklist
                });

                //LocalStorage
                let json_checklist = JSON.stringify(checklist);
                //Only insert or replace id = 1
                let insertSqlStatement =
                  "INSERT OR REPLACE into device_user_wouldYouRather(id, createAccount_id, s1r1, s1r2, s2r1, s2r2, s3r1, s3r2) " +
                  "values(1, 1, ?, ?, ?, ?, ?, ?);";

                db.transaction(
                  tx => {
                    //INSERT DATA
                    tx.executeSql(
                      insertSqlStatement,
                      [
                        this.s1r1,
                        this.s1r2,
                        this.s2r1,
                        this.s2r2,
                        this.s3r1,
                        this.s3r2
                      ],
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
                      "select * from device_user_wouldYouRather",
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
                    //it will put a check mark for wouldYouRather
                    this.props.handlePassed("wouldYouRather", 1);
                  }
                );
              } else {
                //setState
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
                  //put a error marker for wouldYouRather
                  this.props.handlePassed("wouldYouRather", 3);
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
          this.props.handlePassed("wouldYouRather", 3);
        }
      );
    }
  };

  reset = () => {
    this.setState({
      isSuccess: true
    });
  };

  handleListener1 = arg => {
    this.s1r1 = 50 - arg;
    this.s1r2 = 50 + arg;
  };

  handleListener2 = arg => {
    this.s2r1 = 50 - arg;
    this.s2r2 = 50 + arg;
  };

  handleListener3 = arg => {
    this.s3r1 = 50 - arg;
    this.s3r2 = 50 + arg;
  };

  successScreen = () => {
    return (
      <View>
        {this.state.internalErrorWarning && internalErrorWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
          }}
        />
        {/*which do you prefer*/}
        <View style={{ alignItems: "center" }}>
          <Text style={{ opacity: 0.7, color: "white" }}>
            Which do you prefer?
          </Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "5%"
            }}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <View style={{ width: "90%" }}>
            <Slider
              functionListener={this.handleListener1}
              leftBound={"Books"}
              rightBound={"Movie"}
              value={this.state.displaySlider1Value}
            />
            <Text />
          </View>

          <View style={{ width: "90%" }}>
            <Slider
              functionListener={this.handleListener2}
              leftBound={"Wine"}
              rightBound={"Beer"}
              value={this.state.displaySlider2Value}
            />
            <Text />
          </View>

          <View style={{ width: "90%" }}>
            <Slider
              functionListener={this.handleListener3}
              leftBound={"Beach"}
              rightBound={"Mountains"}
              value={this.state.displaySlider3Value}
            />
            <Text />
          </View>
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "10%"
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
  flexSliderContainer: {
    flex: 1
  },
  flexContainer: {
    flex: 1,
    borderColor: "green",
    justifyContent: "center",
    height: height * (1 / 3),
    width: width * (4 / 5),
    borderWidth: 1
  },
  text: {
    color: "white",
    alignItems: "center"
  },
  header: {
    top: height * (1 / 3),
    left: width * (1 / 2)
  },
  parent: {
    flex: 1
  },
  button2: {
    alignItems: "center",
    //backgroundColor: '#fff',
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%",
    zIndex: 1
  },
  buttonStyle: {
    padding: 10,
    alignItems: "center",
    top: height * 0.45
  },
  textView: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  titleText2: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "100"
  },
  viewStyle: {
    top: height * 0.2
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
  warningText: {
    color: "#fff",
    fontSize: 10,
    paddingTop: "3%",
    fontWeight: "bold"
  }
});

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  SetWouldYouRatherDataAction: payload =>
    dispatch(SetWouldYouRatherDataAction(payload)),
  SetChecklistAction: payload => dispatch(SetChecklistAction(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WouldYouRather);
