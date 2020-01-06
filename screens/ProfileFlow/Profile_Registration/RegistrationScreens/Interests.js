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
  TextInput,
  Picker,
  DatePickerIOS,
  TouchableHighlight,
  SafeAreaView,
  Dimensions,
  ActivityIndicator
} from "react-native";
//Redux
import { connect } from "react-redux";
import SetInterestsDataAction from "../../../../storage/actions/RegistrationActions/SetInterestsDataAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//Data
import { likes } from "../Data/Likes.js";

//Icons
import { Icon } from "react-native-elements";

//ScrollView
const screenHeight = Math.round(Dimensions.get("window").height);

//Shared Components
import FailScreen from "../../Profile_SharedComponents/FailScreen";
import NextButton from "../../Profile_SharedComponents/NextButton";

//Picker
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";

//Checker Functions
import { likesChecker } from "../Util/RegistrationScreenCheckers.js";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");
import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage
} from "../../LocalStorage/localStorage.js";

//IP config
import { localhost } from "../../../../config/ipconfig";

//Warning Texts
import {
  invalidLikesWarning,
  internalErrorWarning
} from "../Util/RegistrationScreenWarnings.js";

class Interests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passed: false,
      likesArray: [],
      internalErrorWarning: false,
      isSuccess: true,
      isDelaying: false
    };

    this.isContinueUserFetched = false;
  }

  getDataFromDB = async () => {
    //if checklist says this screen is not complete, return (don't do query)
    if (!this.props.CreateProfileDataReducer.checklist.interests) {
      return;
    }

    await fetch(`http://${localhost}:4000/api/profile/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "interests"
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
            likesArray: object.result.likesArray,
            isSuccess: true
          });

          //LocalStorage
          let json_likesArray = JSON.stringify({
            likesArray: object.result.likesArray
          });
          //Only insert or replace id = 1
          let insertSqlStatement =
            "INSERT OR REPLACE into device_user_interests(id, createAccount_id, likesArray, guid) " +
            "values(1, 1, ?, ?);";

          let { success } = await insertDataIntoLocalStorage(
            insertSqlStatement,
            "device_user_interests",
            [json_likesArray, this.props.CreateProfileDataReducer.guid],
            true
          );

          if (!success) {
            console.log("failed storing data into localStorage");
            //handle error on inserting data into localStorage
          }

          //Redux
          this.props.SetInterestsDataAction({
            likesArray: object.result.likesArray
          });
        } else {
          //INTERNAL ERROR
          throw new Error("internal Error");
        }
      })
      .catch(async err => {
        //HANDLE ANY CATCHED ERRORS
        let object = await selectDataFromLocalStorage(
          "device_user_interests",
          1
        );

        if (object.success) {
          let { likesArray, guid } = object.result.rows._array[0];

          //if there is already a localstroage guid
          //and if that guid doesn't match the guid that is inside redux guid
          //then set the scree to false
          if (guid !== this.props.CreateProfileDataReducer.guid) {
            return this.setState({
              isSuccess: false
            });
          }

          likesArray = JSON.parse(likesArray).likesArray;

          //setState
          this.setState({
            likesArray: likesArray,
            isSuccess: true
          });

          //Redux
          this.props.SetInterestsDataAction({
            likesArray: likesArray
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)

    if (prevState.likesArray !== this.state.likesArray) {
      this.allChecker();
      //For new user only, if something is modified, remove the check icon
      if (!this.props.CreateProfileDataReducer.isContinueUser) {
        this.props.handlePassed("interests", 2);
      }
    }

    if (prevProps.interestsToggle !== this.props.interestsToggle) {
      if (
        this.props.interestsToggle &&
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
    if (
      this.state.passed &&
      this.props.CreateProfileDataReducer.guid !== null
    ) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      checklist.interests = true;

      this.setState(
        {
          isDelaying: true
        },
        () => {
          //Send data to database
          fetch(`http://${localhost}:4000/api/profile/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              guid: this.props.CreateProfileDataReducer.guid,
              collection: "interests",
              data: {
                likesArray: this.state.likesArray,
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
                //Send Data to Redux
                this.props.SetInterestsDataAction({
                  likesArray: this.state.likesArray
                });
                this.props.SetChecklistAction({
                  checklist: checklist
                });

                //LocalStorage
                let json_checklist = JSON.stringify(checklist);
                let json_likesArray = JSON.stringify({
                  likesArray: this.state.likesArray
                });
                //Only insert or replace id = 1
                let insertSqlStatement =
                  "INSERT OR REPLACE into device_user_interests(id, createAccount_id, likesArray, guid) " +
                  "values(1, 1, ?, ?);";

                let { success } = await insertDataIntoLocalStorage(
                  insertSqlStatement,
                  "device_user_interests",
                  [json_likesArray, this.props.CreateProfileDataReducer.guid],
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
                    //it will put a check mark for interests
                    this.props.handlePassed("interests", 1);
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
                  //put a error marker for interests
                  this.props.handlePassed("interests", 3);
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
          this.props.handlePassed("interests", 3);
        }
      );
    }
  };

  allChecker = () => {
    if (likesChecker(this.state.likesArray.length)) {
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
        } else {
          otherScreenOffset1 += 26;
          otherScreenOffset2 += 105;
          otherScreenOffset3 += 65;
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
      38 +
      otherScreenOffset1;
    let colorGreen =
      (topGreen + (bottomGreen - topGreen) * pos) * speedOfYChange -
      209 -
      otherScreenOffset2;
    let colorBlue =
      (topBlue + (bottomBlue - topBlue) * pos) * speedOfYChange -
      151 -
      otherScreenOffset3;

    //default
    colorRed = 67;
    colorGreen = 33;
    colorBlue = 140;

    return `rgb(${colorRed},${colorGreen},${colorBlue})`;
  };

  handlePress = name => {
    // blocks duplicates
    let index = this.state.likesArray.indexOf(name);
    if (index !== -1) {
      let tempAry = [
        ...this.state.likesArray.slice(0, index),
        ...this.state.likesArray.slice(index + 1)
      ];
      this.setState({
        likesArray: tempAry
      });
    } else {
      this.setState({
        likesArray: [...this.state.likesArray, name]
      });
    }
  };

  successScreen = () => {
    let displaylikes = likes.map((e, index = 0) => {
      return (
        <View
          key={index++}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            //this[`b${index}y`] = layout.y + this.props.interestsPositionY;
            this[`b${index}y`] = layout.y;
          }}
        >
          <TouchableOpacity
            style={[
              styles.likeButtonWrap,
              {
                backgroundColor:
                  this.state.likesArray.indexOf(e) === -1
                    ? "#fff"
                    : "rgb(67, 33, 140)"
              }
            ]}
            onPress={() => this.handlePress(e)}
          >
            <Text
              style={[
                styles.likeButton,
                {
                  color:
                    this.state.likesArray.indexOf(e) === -1
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
          <Text style={styles.imInterestedInText}>I'm interested in</Text>
          <Text />
          <Text style={styles.pick3Text}>Pick 3</Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "5%"
            }}
          />
        </View>

        {/*likes*/}
        <View style={styles.likeWrapCenter}>
          <View style={styles.likesWrap}>{displaylikes}</View>
        </View>
        <Text />
        {this.state.likesArray.length !== 3 && invalidLikesWarning}

        {/*Spaces*/}
        <View
          style={{
            padding: "7%"
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
  likeButton: {
    color: "rgb(67, 33, 140)",
    fontSize: 20
  },
  likeButtonWrap: {
    alignItems: "center",
    padding: Math.round(width / 37.5),
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgb(67, 33, 140)",
    width: "auto",
    minWidth: "25%",
    marginLeft: Math.round(width / 125),
    marginRight: Math.round(width / 125),
    marginTop: Math.round(width / 37.5),
    marginBottom: Math.round(width / 37.5)
  },
  imInterestedInText: {
    color: "rgb(67, 33, 140)",
    fontSize: 24
  },
  pick3Text: { opacity: 0.7, color: "rgb(67, 33, 140)" },
  likesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  likeWrapCenter: {
    alignItems: "center"
    //marginTop: "15%"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetInterestsDataAction: payload =>
      dispatch(SetInterestsDataAction(payload)),
    SetChecklistAction: payload => dispatch(SetChecklistAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Interests);
