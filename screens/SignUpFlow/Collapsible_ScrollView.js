import React, { Component } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo";
import CollapseComponent from "./Collapsible_ScrollView_Components/TinyComponents/CollapseComponenet.js";

import { connect } from "react-redux";
import ResetReduxData from "../../storage/actions/ResetReduxData";

import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

//TESTING USES
import InsertDummyData from "../../storage/actions/InsertDummyData";
//TESTING USES

class Collapsible_ScrollView extends Component {
  static navigationOptions = {
    //header: null,
    title: "Welcome!",
    headerStyle: {
      backgroundColor: "#18cdf6"
    },
    footerStyle: {
      backgroundColor: "#fff"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 24
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      createAccountToggle: true,
      aboutYouToggle: false,
      preferencesToggle: false,
      interestsToggle: false,
      wouldYouRatherToggle: false,
      localDestinationsToggle: false,
      createAccountPassed: false,
      aboutYouPassed: false,
      preferencesPassed: false,
      interestsPassed: false,
      wouldYouRatherPassed: false,
      localDestinationsPassed: false,
      currentScreenTopY: 0, //screenTopY : slide down increase ; slide up decrease
      loaded: false //use to make sure if there data inside redux before rendering
    };
    this.interestsPositionY = 0;
    this.localDestinationsPositionY = 0;
    this.preferencesPositionY = 0;
  }

  //TESTING USE BELOW (When onAuth work functionally (login pass data to redux, remove below))
  testcase = () => {

    //decrypt jwt
    //gui
    //checlist

    //see if there have checklist
    //if not checklist, that mean user is firsttime
    //then initlize data as empty


    //if checklist, that mean user is 3rd, 3rd undone, or undone
    //then we use the gui to query the data and insert into redux

    //SETUP DUMMY DATA FOR TESTING
    let mode = "";

    let userData = { gui: "", email: "", password: "" };
    let profData = {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      country: "",
      zipCode: ""
    };
    let interestedData = {
      ageRange: [20, 108],
      distanceRange: 0,
      interestedGender: ""
    };
    let likesData = { likesArray: [] };
    let wouldRatherData = {
      s1r1: 50,
      s1r2: 50,
      s2r1: 50,
      s2r2: 50,
      s3r1: 50,
      s3r2: 50
    };
    let weekendLocation = {
      localDestinations: ""
    };

    //Options
    //Option #1 : Regular User Registration
    //Option #2  : Third Parties Services User Registration
    //Option #3  : Third Parties Services Undone User Registration or Regular Undone User Registration
    let option = 1;

    switch (option) {
      //Regular User Registration
      case 1:
        mode = "";
        break;

      //Third Parties Services User Registration
      //Test Case : only email screen and about you's fistname and lastname is filled up
      case 2:
        mode = "undone";

        userData = { gui: "", email: "ddd@live.com", password: "12345Abc" };
        profData = {
          firstName: "Ken",
          lastName: "Ryuu",
          birthDate: "",
          gender: "",
          country: "",
          zipCode: ""
        };
        break;

      //Third Parties Services Undone User Registration or Regular Undone User Registration
      //Test Case : only email screen, about you screen and wouldyouRather screen is filled up
      //If you want to test with a new account, follow these steps
      //Step 1 : change to option = 1
      //Step 2 : go to sign up and submit a new email and password
      //Step 3 : change to option = 3
      //Step 4 : login to mongodb and copy the objectid for that email
      //Step 5 : replace that objectid to the gui below
      //Step 6 : Now you are ready to test the undone user
      case 3:
        mode = "undone";
        //Comment or Uncomment some of the data fields below to test undone user
        userData = {
          gui: "5d6ec840fabdf1ac4b6da87e",
          email: "ddd@live.com",
          password: "12345Abc"
        };
        profData = {
          firstName: "Ryan",
          lastName: "Albert",
          birthDate: "1993-01-18",
          gender: "male",
          country: "France",
          zipCode: "94612"
        };
        /*
        wouldRatherData = {
          s1r1: 100,
          s1r2: 0,
          s2r1: 0,
          s2r2: 100,
          s3r1: 23,
          s3r2: 77
        };
        */
        interestedData = {
          ageRange: [26, 51],
          distanceRange: 90,
          interestedGender: "male"
        };
        /*
        likesData = { likesArray: ["Food", "Gym", "Hiking"] };
        weekendLocation = {
          localDestinations: "San Francisco"
        };
        */
        break;

      default:
        mode = "";
        break;
    }

    //Pass to Redux
    this.props.InsertDummyData({
      mode: mode,
      userData: userData,
      profData: profData,
      interestedData: interestedData,
      likesData: likesData,
      wouldRatherData: wouldRatherData,
      weekendLocation: weekendLocation
    });
  };
  //TESTING USE ABOVE

  //async and await is used to make sure finish passing data to redux before rendering
  async componentDidMount() {
    //TESTING USE
    //DO SOMETHING TO MAKE SURE REDUX HAS RECEIVED SOME DATA
    await this.testcase();
    this.setState({
      loaded: true
    });
    //TESTING USE
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)
    if (
      this.state.createAccountPassed !== prevState.createAccountPassed ||
      this.state.aboutYouPassed !== prevState.aboutYouPassed ||
      this.state.preferencesPassed !== prevState.preferencesPassed ||
      this.state.interestsPassed !== prevState.interestsPassed ||
      this.state.wouldYouRatherPassed !== prevState.wouldYouRatherPassed ||
      this.state.localDestinationsPassed !== prevState.localDestinationsPassed
    ) {
      this.passChecker();
    }
  }

  passChecker = () => {
    if (
      this.state.createAccountPassed &&
      this.state.aboutYouPassed &&
      this.state.preferencesPassed &&
      this.state.interestsPassed &&
      this.state.wouldYouRatherPassed &&
      this.state.localDestinationsPassed
    ) {
      this.props.ResetReduxData({
        reset: true
      });
      this.props.navigation.navigate("TestRegistrationComplete");
    }
  };

  //When ComponentName/Arrow is pressed, Toggle its states to oppsoite
  handleToggle = (componentName, evt) => {
    //If email screen didn't passed yet, not allow user to click other screen
    if (
      componentName !== "createAccount" &&
      this.state.createAccountPassed === false
    ) {
      return;
    }

    let pageY;
    //If user pressed the "Next Button"
    if (evt === null || evt === undefined) {
      pageY = componentName !== "createAccount" ? 150 : 250;
    } else {
      //If user pressed the Toggle
      pageY = evt.nativeEvent.pageY;
    }

    let toggle = componentName + "Toggle";
    this.setState({
      [toggle]: !this.state[toggle]
    });
    this.scrollToPosition(componentName, pageY);
  };

  //task
  //better email valid
  //for createAccount: after user filled all data and pressed next, the offset is kinda wierd

  //Handle the status of component passing
  //Active when user clicked next button of each screen
  //If the screen passed, give it a check icon
  //If the screen not passed, no change or revert the check icon
  handlePassed = (componentName, passed) => {
    let passName = componentName + "Passed";

    //Handle Duplicate Email; let the createAccount Collapse
    if (componentName === "createAccount" && passed === "duplicate") {
      this.setState(
        {
          createAccountToggle: false,
          createAccountPassed: false
        },
        () => {
          return;
        }
      );
    }

    if (passed) {
      this.setState(
        {
          [passName]: true
        },
        () => {
          //If the screen passed, close the screen
          //Since this is handled by child component (user working inside the child dom)
          //it cannot retrieve the event fire from the child
          //therefore, we passed null to handleToggle
          this.handleToggle(componentName, null);
        }
      );
    } else {
      this.setState({
        [passName]: false
      });
    }
  };

  //handlescroll : update current screen top y
  handleScroll = ({ nativeEvent }) => {
    const { contentOffset } = nativeEvent;
    this.setState({
      currentScreenTopY: contentOffset.y
    });
    //console.log(this.state.currentScreenTopY);
  };

  //Press tab will scroll to that tab position
  scrollToPosition = (componentName, tabPageY) => {
    //this.state.currentScreenTopY : current screen (not scroll) Y position; changed upon scrolling
    //tabPageY : the screen tab's Y position in the whole scroll screen view
    let offset; // offset : an offset to prevent screen scroll too high when closing
    componentName === "createAccount" ? (offset = 250) : (offset = 150);
    const newScrollY = this.state.currentScreenTopY + tabPageY - offset;
    this.scrollView.scrollTo({ y: newScrollY, animated: true });
  };

  render() {
    return this.state.loaded ? (
      <LinearGradient
        textStyle={{ color: "#fff" }}
        colors={["#18cdf6", "#43218c"]}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollView => {
            this.scrollView = scrollView;
          }}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          //Remove this line may have warning for the scrollview?
          //use 16 may cause frame drop?
        >
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inner}>
                <View style={styles.joinBlindlyTextWrap}>
                  <Text style={styles.joinBlindlyText}>Join Blindly</Text>
                </View>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "15%"
                  }}
                />

                {/*Create Account*/}
                <CollapseComponent
                  componentToggle={this.state.createAccountToggle}
                  componentPassed={this.state.createAccountPassed}
                  componentName={"createAccount"}
                  handleToggle={this.handleToggle}
                  handlePassed={this.handlePassed}
                />

                {/*About You*/}
                <CollapseComponent
                  componentToggle={this.state.aboutYouToggle}
                  componentPassed={this.state.aboutYouPassed}
                  componentName={"aboutYou"}
                  handleToggle={this.handleToggle}
                  handlePassed={this.handlePassed}
                />

                {/*Preferences*/}
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.preferencesPositionY = layout.y;
                  }}
                >
                  <CollapseComponent
                    componentToggle={this.state.preferencesToggle}
                    componentPassed={this.state.preferencesPassed}
                    componentName={"preferences"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    currentScreenTopY={this.state.currentScreenTopY}
                    preferencesPositionY={this.preferencesPositionY}
                  />
                </View>

                {/*interests*/}
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.interestsPositionY = layout.y;
                  }}
                >
                  <CollapseComponent
                    componentToggle={this.state.interestsToggle}
                    componentPassed={this.state.interestsPassed}
                    componentName={"interests"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    currentScreenTopY={this.state.currentScreenTopY}
                    interestsPositionY={this.interestsPositionY}
                  />
                </View>

                {/*wouldYouRather*/}
                <CollapseComponent
                  componentToggle={this.state.wouldYouRatherToggle}
                  componentPassed={this.state.wouldYouRatherPassed}
                  componentName={"wouldYouRather"}
                  handleToggle={this.handleToggle}
                  handlePassed={this.handlePassed}
                />

                {/*localDestinations*/}
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.localDestinationsPositionY = layout.y;
                  }}
                >
                  <CollapseComponent
                    componentToggle={this.state.localDestinationsToggle}
                    componentPassed={this.state.localDestinationsPassed}
                    componentName={"localDestinations"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    currentScreenTopY={this.state.currentScreenTopY}
                    localDestinationsPositionY={this.localDestinationsPositionY}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: "5%",
    marginRight: "5%"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  },
  button: {
    color: "#fff",
    fontSize: 20
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
  titleText: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  button2: {
    alignItems: "center",
    //backgroundColor: '#fff',
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1
  },
  joinBlindlyText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "100"
  },
  joinBlindlyTextWrap: {
    alignItems: "center"
  }
});
const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    ResetReduxData: payload => dispatch(ResetReduxData(payload)),
    //TESTING USE
    InsertDummyData: payload => dispatch(InsertDummyData(payload))
    ///TESTING USE
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Collapsible_ScrollView);
