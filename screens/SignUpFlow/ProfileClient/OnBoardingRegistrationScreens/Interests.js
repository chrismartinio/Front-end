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

//Components
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";

//Icons
import { Icon } from "react-native-elements";

//ScrollView
const screenHeight = Math.round(Dimensions.get("window").height);

//Collapsible Components
import FailScreen from "../Components/FailScreen";

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

  getData = async () => {
    //if checklist says this screen is not complete, return (don't do query)
    if (!this.props.CreateProfileDataReducer.checklist[3]) {
      return;
    }

    await fetch("http://74.80.250.210:4000/api/profile/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gui: this.props.CreateProfileDataReducer.gui,
        collection: "interests"
      })
    })
      .then(res => res.json())
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        //console.log(object);
        if (object.success) {
          this.setState({
            likesArray: object.result.likesArray,
            isSuccess: true
          });
          //Send Data to Redux
          this.props.SetInterestsDataAction({
            likesArray: object.result.likesArray
          });
        } else {
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        console.log(err);
        //if fail while fetching, direct user to failScreen
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
          this.getData();
          this.isContinueUserFetched = true;
        }
      }
    }
  }

  handleSubmit = () => {
    //if the screen passed and gui is not null (that means user had finished createAccount)
    if (this.state.passed && this.props.CreateProfileDataReducer.gui !== null) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      let index = 3;
      checklist = [
        ...checklist.slice(0, index),
        true,
        ...checklist.slice(index + 1)
      ];
      this.props.SetChecklistAction({
        checklist: checklist
      });

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
              gui: this.props.CreateProfileDataReducer.gui,
              collection: "interests",
              data: {
                likesArray: this.state.likesArray,
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
                this.props.SetInterestsDataAction({
                  likesArray: this.state.likesArray
                });
                //if successed to passed,
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
                  //put a error marker for interests
                  this.props.handlePassed("interests", 3);
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
          this.props.handlePassed("interests", 3);
        }
      );
    }
  };

  likesChecker = () => {
    if (this.state.likesArray.length >= 3) {
      return true;
    }
    return false;
  };

  allChecker = () => {
    if (this.likesChecker()) {
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
    let invalidLikesWarning = (
      <View style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Icon
            type="font-awesome"
            name="exclamation-circle"
            color="#fff"
            iconStyle={{ top: 3 }}
          />
          <Text style={styles.warningText}>
            {"   "}Please select 3 interests
          </Text>
        </View>
      </View>
    );

    let internalErrorWarning = (
      <Text style={styles.warningText}>
        * Some error occurred. Please try again!
      </Text>
    );

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
                    ? "transparent"
                    : "white"
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
          <Text style={{ opacity: 0.7, color: "white" }}>Pick at least 3</Text>
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

        {/*likes*/}
        <View style={styles.likeWrapCenter}>
          <View style={styles.likesWrap}>{displaylikes}</View>
        </View>
        <Text />
        {this.state.likesArray.length < 3 && invalidLikesWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "7%"
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

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  likeButton: {
    color: "#fff",
    fontSize: 20
  },
  likeButtonWrap: {
    alignItems: "center",
    padding: width / 37.5,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "auto",
    minWidth: "25%",
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    marginBottom: 10
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
  likesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  likeWrapCenter: {
    alignItems: "center"
    //marginTop: "15%"
  },
  warningText: {
    color: "#fff",
    fontSize: 10,
    paddingTop: "3%",
    fontWeight: "bold"
  }
});

const likes = [
  "Food",
  "Dancing",
  "Pets",
  "Gym",
  "Shopping",
  "Sports",
  "Hiking",
  "Music",
  "Travel"
];

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
