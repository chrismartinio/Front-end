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
import SetPreferencesDataAction from "../../../../storage/actions/RegistrationActions/SetPreferencesDataAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//Components
import Slider from "../Components/Sliders/PreferencesSlider";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

//Icons
import { Icon } from "react-native-elements";

//ScrollView
const screenHeight = Math.round(Dimensions.get("window").height);

//Collapsible Components
import FailScreen from "../Components/FailScreen";

//checker functions
import { genderChecker } from "../Util/OnBoardingRegistrationScreenCheckers.js";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");

//warnings
import {
  emptyGenderWarning,
  internalErrorWarning
} from "../Util/OnBoardingRegistrationScreenWarnings.js";

class Preferences extends Component {
  //having null header means no back  button is present!
  constructor(props) {
    super(props);
    this.state = {
      pickedMen: false,
      pickedWomen: false,
      sliderOneChanging: false,
      sliderOneValue: [5],
      ageRange: [20, 108],
      interestedGenderWarning: "empty",
      passed: false,
      distanceRange: 0,
      internalErrorWarning: false,
      isSuccess: true,
      isDelaying: false
    };

    //Control Button Text Color based on Current Screen's Position
    this.bMaley = 0;
    this.bFemaley = 0;

    this.isContinueUserFetched = false;
  }

  getData = async () => {
    //if checklist says this screen is not complete, return (don't do query)
    if (!this.props.CreateProfileDataReducer.checklist.preferences) {
      return;
    }

    await fetch("http://74.80.250.210:4000/api/profile/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "preferences"
      })
    })
      .then(res => res.json())
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        //console.log(object);
        if (object.success) {
          let pickedMen, pickedWomen;
          if (object.result.interestedGender === "both") {
            pickedMen = true;
            pickedWomen = true;
          } else if (object.result.interestedGender === "male") {
            pickedMen = true;
          } else if (object.result.interestedGender === "female") {
            pickedWomen = true;
          } else {
            pickedMen = false;
            pickedWomen = false;
          }
          this.setState({
            pickedMen: pickedMen,
            pickedWomen: pickedWomen,
            interestedGenderWarning:
              pickedMen === "" && pickedWomen === "" ? "empty" : "",
            ageRange: object.result.ageRange,
            distanceRange: object.result.distanceRange,
            isSuccess: true
          });

          //Send Data to Redux
          this.props.SetPreferencesDataAction({
            ageRange: object.result.ageRange,
            distanceRange: object.result.distanceRange,
            interestedGender: object.result.interestedGender
          });
        } else {
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //If error while fetching, direct user to fail screen
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
      this.state.pickedMen !== prevState.pickedMen ||
      this.state.pickedWomen !== prevState.pickedWomen ||
      this.state.distanceRange !== prevState.distanceRange
    ) {
      this.allChecker();
      //For new user only, if something is modified, remove the check icon
      if (!this.props.CreateProfileDataReducer.isContinueUser) {
        this.props.handlePassed("preferences", 2);
      }
    }

    if (prevProps.preferencesToggle !== this.props.preferencesToggle) {
      if (
        this.props.preferencesToggle &&
        this.props.CreateProfileDataReducer.isContinueUser
      ) {
        if (!this.isContinueUserFetched) {
          this.getData();
          this.isContinueUserFetched = true;
        }
      }
    }
  }

  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  //match radius
  setDistanceRange = arg => {
    this.setState({
      distanceRange: arg
    });
  };

  //age range
  ageRangeChange = values => {
    this.setState({
      ageRange: values
    });
  };

  //gender
  pickedGender = gender => {
    this.setState({
      [gender]: !this.state[gender]
    });
  };

  allChecker = () => {
    //let distance = false;
    let distance = true;
    let gender = false;

    if (!genderChecker(this.state.pickedMen, this.state.pickedWomen)) {
      gender = false;
      this.setState(
        {
          interestedGenderWarning: "empty"
        },
        () => {
          return;
        }
      );
    } else {
      gender = true;
      this.setState({
        interestedGenderWarning: ""
      });
    }

    if (gender && distance) {
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

    this.props.otherToggle.forEach(toggle => {
      if (toggle) {
        otherScreenOffset1 += 25;
        otherScreenOffset2 += 100;
        otherScreenOffset3 += 61;
      }
    });

    const topRed = 24;
    const topGreen = 205;
    const topBlue = 246;

    const bottomRed = 67;
    const bottomGreen = 33;
    const bottomBlue = 140;

    let pos = (this[bname] - topY) / screenHeight;

    //not the best solution (kinda hard code)
    //the toggle above will add up Offset for other screens
    //and there also a constant number which is the current screen otherScreenOffset

    let colorRed =
      (topRed + (bottomRed - topRed) * pos) * speedOfYChange +
      24 +
      otherScreenOffset1;
    let colorGreen =
      (topGreen + (bottomGreen - topGreen) * pos) * speedOfYChange -
      150 -
      otherScreenOffset2;
    let colorBlue =
      (topBlue + (bottomBlue - topBlue) * pos) * speedOfYChange -
      116 -
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
      //check the user's interestGender and pass to redux and db
      let interestedGender = "";
      if (this.state.pickedMen && this.state.pickedWomen) {
        interestedGender = "both";
      } else if (this.state.pickedMen) {
        interestedGender = "male";
      } else if (this.state.pickedWomen) {
        interestedGender = "female";
      } else {
        interestedGender = "";
      }

      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      checklist.preferences = true;

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
              collection: "preferences",
              data: {
                ageRange: this.state.ageRange,
                distanceRange: this.state.distanceRange,
                interestedGender: interestedGender,
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
                this.props.SetPreferencesDataAction({
                  ageRange: this.state.ageRange,
                  distanceRange: this.state.distanceRange,
                  interestedGender: interestedGender
                });
                this.props.SetChecklistAction({
                  checklist: checklist
                });

                //LocalStorage
                let json_checklist = JSON.stringify(checklist);
                let json_ageRange = JSON.stringify({
                  ageRange: this.state.ageRange
                });
                //Only insert or replace id = 1
                let insertSqlStatement =
                  "INSERT OR REPLACE into device_user_preferences(id, createAccount_id, interestedGender, ageRange, distanceRange) " +
                  "values(1, 1, ?, ?, ?);";

                db.transaction(
                  tx => {
                    //INSERT DATA
                    tx.executeSql(
                      insertSqlStatement,
                      [
                        interestedGender,
                        json_ageRange,
                        this.state.distanceRange
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
                      "select * from device_user_preferences",
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
                    //it will put a check mark for preferences
                    this.props.handlePassed("preferences", 1);
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
                  //put a error marker for preferences
                  this.props.handlePassed("preferences", 3);
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
          this.props.handlePassed("preferences", 3);
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
            padding: "5%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
        {/*I'm interested in Text & Pick one of both Text*/}
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 24 }}>
            I'm interested in
          </Text>
          <Text />
          <Text style={{ opacity: 0.7, color: "white" }}>Pick one or both</Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "5%"
              //borderRadius: 4,
              //borderWidth: 0.5,
              //borderColor: "#d6d7da"
            }}
          />
        </View>

        {/*Men and Women buttons */}
        <View
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            //this.bMaley = layout.y + this.props.preferencesPositionY;
            //this.bFemaley = layout.y + this.props.preferencesPositionY;
            this.bMaley = layout.y;
            this.bFemaley = layout.y;
          }}
          style={{ alignItems: "center" }}
        >
          {/*Men*/}
          <TouchableOpacity
            style={[
              styles.genderButtonWrap,
              {
                backgroundColor: this.state.pickedMen ? "white" : "transparent"
              }
            ]}
            onPress={() => {
              this.pickedGender("pickedMen");
            }}
          >
            <Text
              style={[
                styles.button,
                {
                  color: this.state.pickedMen
                    ? this.changeColor(`bMaley`)
                    : "white"
                }
              ]}
            >
              Men
            </Text>
          </TouchableOpacity>
          <Text />
          {/*Women*/}
          <TouchableOpacity
            style={[
              styles.genderButtonWrap,
              {
                backgroundColor: this.state.pickedWomen
                  ? "white"
                  : "transparent"
              }
            ]}
            onPress={() => {
              this.pickedGender("pickedWomen");
            }}
          >
            <Text
              style={[
                styles.button,
                {
                  color: this.state.pickedWomen
                    ? this.changeColor(`bFemaley`)
                    : "white"
                }
              ]}
            >
              Women
            </Text>
          </TouchableOpacity>
          <Text />
        </View>
        {this.state.interestedGenderWarning === "empty" && emptyGenderWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "10%"
          }}
        />

        {/*Preferred age range*/}
        <View>
          <Text style={styles.textTop}>Preferred age range</Text>
          <View style={styles.flexContainer}>
            <Text style={styles.text2}> {this.state.ageRange[0]} </Text>
            <Text style={styles.text2}> {this.state.ageRange[1]} </Text>
          </View>
          <MultiSlider
            values={[this.state.ageRange[0], this.state.ageRange[1]]}
            onValuesChange={this.ageRangeChange}
            min={18}
            max={110}
            step={1}
            allowOverlap
            snapped
            trackStyle={{
              shadowColor: "red",
              backgroundColor: "white"
            }}
          />
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "10%"
          }}
        />

        {/*Preferred match radius*/}
        <View>
          <Text style={styles.textTop}>Preferred match radius</Text>
          <Slider
            functionListener={this.setDistanceRange}
            minimumValue={0}
            maximumValue={110}
            leftBound={"0"}
            rightBound={"110"}
            value={this.state.distanceRange}
          />
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
    return <FailScreen getDataFunction={this.getData} reset={this.reset} />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.failScreen();
  }
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
    ///backgroundColor: '#fff',
  },
  titleText: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  text2: {
    color: "white"
  },
  titleText2: {
    margin: 10,
    color: "#fff",
    fontSize: 24,
    top: 25,
    textAlign: "center"
  },
  _textInput: {
    color: "#fff",
    fontSize: 20,
    textAlign: "left",
    paddingTop: "20%",
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  smallText: {
    margin: 10,
    color: "#fff",
    fontSize: 10
  },
  text: {
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  textTop: {
    //top: 40,
    //margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  textTop2: {
    top: 60,
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  button: {
    color: "#fff",
    fontSize: 20
  },
  button2: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  flexContainer: {
    //top: height *.45,
    flexDirection: "row",
    justifyContent: "space-between",
    //position:'absolute',
    alignItems: "stretch"
  },
  slider1: {
    top: 60
  },
  slider2: {
    top: 80
  },
  slider3: {
    top: 15
  },
  warningText: {
    color: "#fff",
    fontSize: 10,
    paddingTop: "3%",
    fontWeight: "bold"
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
  genderButtonWrap: {
    alignItems: "center",
    padding: 7,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "65%"
  }
});

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  SetPreferencesDataAction: payload =>
    dispatch(SetPreferencesDataAction(payload)),
  SetChecklistAction: payload => dispatch(SetChecklistAction(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preferences);
