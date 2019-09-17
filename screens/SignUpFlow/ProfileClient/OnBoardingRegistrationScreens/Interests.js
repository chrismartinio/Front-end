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
  Dimensions
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

class Interests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passed: false,
      likesArray: [],
      internalErrorWarning: false
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

    this.mode = "";
    this.gui = "";
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)

    if (prevState.likesArray !== this.state.likesArray) {
      this.allChecker();
      //any changes will remove the check mark from CollapsibleComponent CheckMark
      this.props.handlePassed("interests", 2);
    }
  }

  handleSubmit = () => {
    if (this.state.passed) {
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

      //Send data to database
      fetch("http://74.80.250.210:5000/api/profile/update", {
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
            //if successed to passed, it will put the check mark from CollapsibleComponent CheckMark
            this.setState(
              {
                internalErrorWarning: false
              },
              () => {
                this.props.handlePassed("interests", 1);
              }
            );
          } else {
            throw new Error("Internal Error ");
          }
        })
        .catch(error => {
          this.setState(
            {
              internalErrorWarning: true
            },
            () => {
              this.props.handlePassed("interests", 3);
            }
          );
        });
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
    let topY = this.props.currentScreenTopY;

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
  render() {
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
      <Text style={styles.warningText}>* Internal Error. Please Try again</Text>
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
            disabled={!this.state.passed}
          >
            <Text style={styles.button}>Next</Text>
          </TouchableOpacity>
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  likeButton: {
    color: "#fff",
    fontSize: 20
  },
  likeButtonWrap: {
    alignItems: "center",
    padding: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "auto",
    minWidth: "25%",
    margin: 5
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
