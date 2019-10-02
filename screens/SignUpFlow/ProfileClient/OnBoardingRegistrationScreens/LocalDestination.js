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
  Dimensions
} from "react-native";

//Redux
import { connect } from "react-redux";
import SetLocalDestinationDataAction from "../../../../storage/actions/RegistrationActions/SetLocalDestinationDataAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//Icons
import { Icon } from "react-native-elements";

//ScrollView
const screenHeight = Math.round(Dimensions.get("window").height);

//Collapsible Components
import FailScreen from "../Components/FailScreen";

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

    //Control Button Text Color based on Current Screen's Position
    this.b1y = 0;
    this.b2y = 0;
    this.b3y = 0;
    this.b4y = 0;
    this.b5y = 0;
    this.b6y = 0;
    this.b7y = 0;
    this.b8y = 0;
    this.b9y = 0;

    this.isContinueUserFetched = false;
  }

  getData = async () => {
    //if checklist says this screen is not complete, return (don't do query)
    if (!this.props.CreateProfileDataReducer.checklist[5]) {
      return;
    }

    await fetch("http://74.80.250.210:5000/api/profile/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gui: this.props.CreateProfileDataReducer.gui,
        collection: "localDestination"
      })
    })
      .then(res => res.json())
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        //console.log(object);
        if (object.success) {
          this.setState({
            localDestination: object.result.localDestination,
            isSuccess: true
          });
          //Send Data to Redux
          this.props.SetLocalDestinationDataAction({
            localDestination: object.result.localDestination
          });
        } else {
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //if error while fetching, direct user to fail screen
        this.setState({
          isSuccess: false
        });
      });
  };

  startwithEmpty = () => {
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
          this.getData();
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

  locationsChecker = () => {
    if (this.state.localDestination !== "") {
      return true;
    }
    return false;
  };

  allChecker = () => {
    if (this.locationsChecker()) {
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

    const topRed = 24;
    const topGreen = 205;
    const topBlue = 246;
    const bottomRed = 67;
    const bottomGreen = 33;
    const bottomBlue = 140;

    let pos = (this[bname] - topY) / screenHeight;

    let colorRed = topRed + (bottomRed - topRed) * pos;
    let colorGreen = topGreen + (bottomGreen - topGreen) * pos;
    let colorBlue = topBlue + (bottomBlue - topBlue) * pos;

    return `rgb(${colorRed},${colorGreen},${colorBlue})`;
  };

  handleSubmit = () => {
    //if the screen passed and gui is not null (that means user had finished createAccount)
    if (this.state.passed && this.props.CreateProfileDataReducer.gui !== null) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      let index = 5;
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
          fetch("http://74.80.250.210:5000/api/profile/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              gui: this.props.CreateProfileDataReducer.gui,
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
              console.log(object);
              if (object.success) {
                //Send Data to Redux
                this.props.SetLocalDestinationDataAction({
                  localDestination: this.state.localDestination
                });
                //if successed to passed,
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
                  //put a error marker for localDestination
                  this.props.handlePassed("localDestination", 3);
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
          this.props.handlePassed("localDestination", 3);
        }
      );
    }
  };

  successScreen = () => {
    let emptyCityWarning = (
      <View style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Icon
            type="font-awesome"
            name="exclamation-circle"
            color="#fff"
            iconStyle={{ top: 3 }}
          />
          <Text style={styles.warningText}>{"   "}Please select a city</Text>
        </View>
      </View>
    );

    let internalErrorWarning = (
      <Text style={styles.warningText}>
        * Some error occurred. Please try again!
      </Text>
    );

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
        {this.state.internalErrorWarning && internalErrorWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
          }}
        />
        {/*I'm interested in Text & Pick one of both Text*/}
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 24 }}>Spend a weekend</Text>
          <Text />
          <Text style={{ opacity: 0.7, color: "white" }}>Pick 1</Text>
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
            <Text style={styles.button}>
              {this.state.passed && this.state.isDelaying
                ? "Submitting"
                : "Next"}
            </Text>
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
      <FailScreen
        getDataFunction={this.getData}
        startwithEmpty={this.startwithEmpty}
      />
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
  locationsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  locationsWrapCenter: {
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

const locations = [
  "San Francisco",
  "Tahoe",
  "Monterey",
  "Big Sur",
  "Napa",
  "Santa Cruz",
  "Yosemite",
  "Morro Bay"
];

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
