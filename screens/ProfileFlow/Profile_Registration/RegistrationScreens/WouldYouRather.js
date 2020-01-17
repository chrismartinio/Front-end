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

//Shared Components
import FailScreen from "../../Profile_SharedComponents/FailScreen";
import NextButton from "../../Profile_SharedComponents/NextButton";

//Slider
import Slider from "../../Profile_SharedComponents/Sliders/WouldYouRatherSlider";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");
import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage
} from "../../LocalStorage/localStorage.js";

//IP Config
import { server_profile } from "../../../../config/ipconfig";

//Warning Texts
import { internalErrorWarning } from "../Util/RegistrationScreenWarnings.js";

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

    await fetch(`${server_profile}/api/profile/query`, {
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
      .then(async res => {
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
            "INSERT OR REPLACE into device_user_wouldYouRather(id, createAccount_id, s1r1, s1r2, s2r1, s2r2, s3r1, s3r2, guid) " +
            "values(1, 1, ?, ?, ?, ?, ?, ?, ?);";

          let { success } = await insertDataIntoLocalStorage(
            insertSqlStatement,
            "device_user_wouldYouRather",
            [
              object.result.s1r1,
              object.result.s1r2,
              object.result.s2r1,
              object.result.s2r2,
              object.result.s3r1,
              object.result.s3r2,
              this.props.CreateProfileDataReducer.guid
            ],
            true
          );

          if (!success) {
            console.log("failed storing data into localStorage");
            //handle error on inserting data into localStorage
          }

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
      .catch(async err => {
        //HANDLE ANY CATCHED ERRORS
        let object = await selectDataFromLocalStorage(
          "device_user_wouldYouRather",
          1
        );

        if (object.success) {
          let {
            s1r1,
            s1r2,
            s2r1,
            s2r2,
            s3r1,
            s3r2,
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

          //Redux
          this.props.SetWouldYouRatherDataAction({
            s1r1: s1r1,
            s1r2: s1r2,
            s2r1: s2r1,
            s2r2: s2r2,
            s3r1: s3r1,
            s3r2: s3r2
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
          fetch(`${server_profile}/api/profile/update`, {
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
                  "INSERT OR REPLACE into device_user_wouldYouRather(id, createAccount_id, s1r1, s1r2, s2r1, s2r2, s3r1, s3r2, guid) " +
                  "values(1, 1, ?, ?, ?, ?, ?, ?, ?);";

                let { success } = await insertDataIntoLocalStorage(
                  insertSqlStatement,
                  "device_user_wouldYouRather",
                  [
                    this.s1r1,
                    this.s1r2,
                    this.s2r1,
                    this.s2r2,
                    this.s3r1,
                    this.s3r2,
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
    this.setState({
      displaySlider1Value: this.s1r2 - 50
    });
  };

  handleListener2 = arg => {
    this.s2r1 = 50 - arg;
    this.s2r2 = 50 + arg;
    this.setState({
      displaySlider2Value: this.s2r2 - 50
    });
  };

  handleListener3 = arg => {
    this.s3r1 = 50 - arg;
    this.s3r2 = 50 + arg;
    this.setState({
      displaySlider3Value: this.s3r2 - 50
    });
  };

  successScreen = () => {
    return (
      <View>
        {/*Internal Error Warning*/}
        {this.state.internalErrorWarning && internalErrorWarning}

        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
          }}
        />

        {/*which do you prefer Text*/}
        <View style={{ alignItems: "center" }}>
          <Text style={styles.whatDoYouPreferText}>Which do you prefer?</Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "5%"
            }}
          />
        </View>

        {/*Sliders*/}
        <View style={{ alignItems: "center" }}>
          {/*Slider1*/}
          <View style={{ width: "90%" }}>
            {/*Line 447 is to fix the UI leak for android*/}
            {this.props.wouldYouRatherToggle ? (
              <Slider
                functionListener={this.handleListener1}
                minimumValue={0}
                maximumValue={100}
                leftBound={"Books"}
                rightBound={"Movie"}
                value={this.state.displaySlider1Value}
              />
            ) : null}
            <Text />
          </View>

          {/*Slider2*/}
          <View style={{ width: "90%" }}>
            {this.props.wouldYouRatherToggle ? (
              <Slider
                functionListener={this.handleListener2}
                minimumValue={0}
                maximumValue={100}
                leftBound={"Wine"}
                rightBound={"Beer"}
                value={this.state.displaySlider2Value}
              />
            ) : null}
            <Text />
          </View>

          {/*Slider3*/}
          <View style={{ width: "90%" }}>
            {this.props.wouldYouRatherToggle ? (
              <Slider
                functionListener={this.handleListener3}
                minimumValue={0}
                maximumValue={100}
                leftBound={"Beach"}
                rightBound={"Mountains"}
                value={this.state.displaySlider3Value}
              />
            ) : null}
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
  header: {
    top: height * (1 / 3),
    left: width * (1 / 2)
  },
  whatDoYouPreferText: { opacity: 0.7, color: "#6a0dad" }
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
