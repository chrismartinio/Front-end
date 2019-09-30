import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  ScrollView,
  TouchableOpacity
} from "react-native";

//Redux
import { connect } from "react-redux";
import SetWouldYouRatherDataAction from "../../../../storage/actions/RegistrationActions/SetWouldYouRatherDataAction";
import SetChecklistAction from "../../../../storage/actions/RegistrationActions/SetChecklistAction";

//component
import Slider from "../Components/Sliders/WouldYouRatherSlider";

//Collapsible Components
import LoadingScreen from "../Components/LoadingScreen";

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
      isLoading: true,
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

  getData = async () => {
    //do something with redux
    await fetch("http://74.80.250.210:5000/api/profile/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gui: this.props.CreateProfileDataReducer.gui,
        collection: "wouldYouRather"
      })
    })
      .then(res => res.json())
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        //console.log(object);
        if (object.success) {
          this.setState({
            displaySlider1Value: object.result.s1r2 - 50,
            displaySlider2Value: object.result.s2r2 - 50,
            displaySlider3Value: object.result.s3r2 - 50,
            isLoading: true,
          });
        } else {
          throw new Error("internal Error");
        }
      })
      .catch(err => {
        //throw to is loading screen or ask user to click a button for refetch
        //to fetch the data
        this.setState({
          isLoading: false
        });
      });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.wouldYouRatherToggle !== this.props.wouldYouRatherToggle) {
      if (
        this.props.wouldYouRatherToggle &&
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
    if (this.props.CreateProfileDataReducer.gui !== null) {
      //Set the screen's checklist index to true
      let checklist = this.props.CreateProfileDataReducer.checklist;
      let index = 4;
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
              console.log(object);
              if (object.success) {
                //Send Data to Redux
                this.props.SetWouldYouRatherDataAction({
                  s1r1: this.s1r1,
                  s1r2: this.s1r2,
                  s2r1: this.s2r1,
                  s2r2: this.s2r2,
                  s3r1: this.s3r1,
                  s3r2: this.s3r2
                });
                //if successed to passed,
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
                  //put a error marker for wouldYouRather
                  this.props.handlePassed("wouldYouRather", 3);
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
          this.props.handlePassed("wouldYouRather", 3);
        }
      );
    }
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
    let internalErrorWarning = (
      <Text style={styles.warningText}>* Internal Error. Please Try again</Text>
    );
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

  loadingScreen = () => {
    //display fetching data
    return <LoadingScreen />;
  };

  render() {
    return this.state.isLoading ? this.successScreen() : this.loadingScreen();
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
