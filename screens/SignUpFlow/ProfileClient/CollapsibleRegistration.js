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
  TouchableOpacity
} from "react-native";

//background color
import { LinearGradient } from "expo-linear-gradient";

//Collapsible Components
import CollapsibleScreenTab from "./Components/CollapsibleScreenTab";
import LoadingScreen from "./Components/LoadingScreen";

//Icons
import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

//Redux
import { connect } from "react-redux";
import ResetReduxDataAction from "../../../storage/actions/RegistrationActions/ResetReduxDataAction";
import SetIsContinueUserAction from "../../../storage/actions/RegistrationActions/SetIsContinueUserAction";
import SetUserAllDataAction from "../../../storage/actions/RegistrationActions/SetUserAllDataAction";
import SetGUIAction from "../../../storage/actions/RegistrationActions/SetGUIAction";

//direction: decrypt jwt -> retrieve gui and checklist -> store gui into redux ->

class CollapisbleRegistration extends Component {
  //LinksScreen Test Tool
  static navigationOptions = {
    title: "Welcomes!",
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
      createAccountToggle: true, //true or false
      aboutYouToggle: false,
      preferencesToggle: false,
      interestsToggle: false,
      wouldYouRatherToggle: false,
      localDestinationToggle: false,
      createAccountPassed: false, //true or false
      aboutYouPassed: false,
      preferencesPassed: false,
      interestsPassed: false,
      wouldYouRatherPassed: false,
      localDestinationPassed: false,
      createAccountStatus: "empty", //empty, passed, or error
      aboutYouStatus: "empty",
      preferencesStatus: "empty",
      interestsStatus: "empty",
      wouldYouRatherStatus: "empty",
      localDestinationStatus: "empty",
      isLoading: false //use to make sure if there data inside redux before rendering
    };
    this.scrollY = 0;
  }

  getJWT = () => {
    let jwt = this.props.CreateThirdPartyDataReducer.JWT;
    if (jwt === null || jwt === undefined) {
      return "";
    }
    return jwt;
  };

  decryptJWT = jwt => {
    //console.log('jwt', jwt)
    //do something to retrieve gui and check from the jwt
    //gui is empty? = first time local user
    //gui is not empty? = third parties user, third parties continue user, local continue user
    return {
      //For isContinueUser
      gui: "5d92c7fa6ef207cd57b261ca",
      checklist: [true, true, true, true, false, false]
      //Error: if checklist not match to screen
      //let say if intersts screen has not submit but checklist[3] shows is true
      //since checklist[3] is true, the screen would try to fetch data
      //since no data, it will return null, and object.result.likesArray = null which will throw err
      //but this structure is built intend

      //For new User
      //gui: "",
      //checklist: [true, false, false, false, false, false]
    };
  };

  setUserStatus = jwtObject => {
    //mark the user as continue user
    //and store the checklist in redux
    this.props.SetIsContinueUserAction({
      isContinueUser: true,
      checklist: jwtObject.checklist
    });
    //pass gui
    this.props.SetGUIAction({
      gui: jwtObject.gui
    });

    //set fb,twitter,ig,... user name
    //even they have firstname, lastname
    //doesn't mean checklist[1] is true

    //set the status for screen
    this.setState({
      createAccountPassed: jwtObject.checklist[0],
      aboutYouPassed: jwtObject.checklist[1],
      preferencesPassed: jwtObject.checklist[2],
      interestsPassed: jwtObject.checklist[3],
      wouldYouRatherPassed: jwtObject.checklist[4],
      localDestinationPassed: jwtObject.checklist[5],
      createAccountStatus: "passed", //isContinueUser always true for createAccountStatus
      aboutYouStatus: jwtObject.checklist[1] ? "passed" : "empty",
      preferencesStatus: jwtObject.checklist[2] ? "passed" : "empty",
      interestsStatus: jwtObject.checklist[3] ? "passed" : "empty",
      wouldYouRatherStatus: jwtObject.checklist[4] ? "passed" : "empty",
      localDestinationStatus: jwtObject.checklist[5] ? "passed" : "empty"
    });
  };

  async componentDidMount() {
    //a warning that if checklist is [true, true, true, true, true, true]
    //Since Auth will handle if the checklist is a continue user or new user
    //continue user : [true, false, false, true, true, true]
    //new user : [true, false, false, false, false, false]
    //third parties user / continue user : [true, true, false, false, false, false]
    //If [true, true, true, true, true, true], Auth will pass user to profile instead of registration

    //get the gui and checklist from decrypted jwt
    let jwtObject = this.decryptJWT(this.getJWT());

    //check if the user is a continue user.
    //if there have at least one true inside the checklist array,
    //then the user is a continue user
    //Note, checklist[0], createAccount screen is set to true by default
    //because users must submit createAcctoun screen in order to create a profile on db
    //that begin said, createAccount screen must always true if they are continue user
    let isContinueUser = jwtObject.checklist.slice(1).find(screens => {
      return screens;
    });
    isContinueUser = isContinueUser === undefined ? false : true;

    //if the user is a continue user, set isContinueUser is true in Redux
    if (isContinueUser) {
      await this.setUserStatus(jwtObject);
    }

    //Trigger render() again after gui and checklist are store into redux
    this.setState({
      isLoading: true
    });
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
      this.state.localDestinationPassed !== prevState.localDestinationPassed
    ) {
      this.passChecker();
    }
  }

  //If all screens are passed, navigate to the RegistrationComplete Screen
  passChecker = () => {
    if (
      this.state.createAccountPassed &&
      this.state.aboutYouPassed &&
      this.state.preferencesPassed &&
      this.state.interestsPassed &&
      this.state.wouldYouRatherPassed &&
      this.state.localDestinationPassed
    ) {
      this.props.ResetReduxDataAction({
        reset: true
      });
      this.props.navigation.navigate("TestRegistrationComplete");
    }
  };

  //Handle the status of screen
  handlePassed = (componentName, passed) => {
    let passName = componentName + "Passed";
    let toggleName = componentName + "Toggle";
    let statusName = componentName + "Status";
    //1 means screen is passed
    //2 means screen is not passed; something has changed; some fields is not filled yet
    //3 means there error on api fetchting or server internal error

    //Handle Duplicate Email; let the createAccount screen stay remain
    if (passed === 1) {
      this.setState(
        {
          [passName]: true,
          [statusName]: "passed",
          [toggleName]: false
        },
        () => {
          this.scrollView.scrollTo({ y: 0, animated: true });
        }
      );
    } else if (passed === 2) {
      this.setState({
        [passName]: false,
        [toggleName]: true, //keep the toggle remain
        [statusName]: "empty"
      });
    } else {
      this.setState({
        [toggleName]: true, //keep the toggle remain
        [passName]: false, //that screen is not passed.
        [statusName]: "error"
      });
    }
  };

  //If screen tab is pressed, Toggle its states to oppsoite
  handleToggle = (componentName, evt) => {
    //If createAccount screen didn't passed yet, not allow user to click other screen
    if (
      componentName !== "createAccount" &&
      this.state.createAccountPassed === false
    ) {
      return;
    }

    let pageY = evt !== null ? evt.nativeEvent.pageY : 0;
    let offset = 125;
    let toggle = componentName + "Toggle";
    this.setState(
      {
        [toggle]: !this.state[toggle]
      },
      () => {
        if (this.state[toggle]) {
          this.scrollView.scrollTo({
            y: this.scrollY + pageY - offset,
            animated: true
          });
        } else {
          this.scrollView.scrollTo({ y: 0, animated: true });
        }
      }
    );
  };

  //handlescroll : update current screen top y
  handleScroll = ({ nativeEvent }) => {
    const { contentOffset } = nativeEvent;
    this.scrollY = contentOffset.y;
  };

  SuccessScreen = () => {
    return (
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
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.createAccountPositionY = layout.y;
                  }}
                >
                  <CollapsibleScreenTab
                    componentToggle={this.state.createAccountToggle}
                    componentPassed={this.state.createAccountPassed}
                    componentStatus={this.state.createAccountStatus}
                    componentName={"createAccount"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    scrollView={this.scrollView}
                  />
                </View>

                {/*About You*/}
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.aboutYouPositionY = layout.y;
                  }}
                >
                  <CollapsibleScreenTab
                    componentToggle={this.state.aboutYouToggle}
                    componentPassed={this.state.aboutYouPassed}
                    componentStatus={this.state.aboutYouStatus}
                    componentName={"aboutYou"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    scrollView={this.scrollView}
                  />
                </View>

                {/*Preferences*/}
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.preferencesPositionY = layout.y;
                  }}
                >
                  <CollapsibleScreenTab
                    componentToggle={this.state.preferencesToggle}
                    componentPassed={this.state.preferencesPassed}
                    componentStatus={this.state.preferencesStatus}
                    componentName={"preferences"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    scrollY={this.scrollY}
                    scrollView={this.scrollView}
                  />
                </View>

                {/*interests*/}
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.interestsPositionY = layout.y;
                  }}
                >
                  <CollapsibleScreenTab
                    componentToggle={this.state.interestsToggle}
                    componentPassed={this.state.interestsPassed}
                    componentStatus={this.state.interestsStatus}
                    componentName={"interests"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    scrollY={this.scrollY}
                    scrollView={this.scrollView}
                  />
                </View>

                {/*wouldYouRather*/}
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.wouldYouRatherPositionY = layout.y;
                  }}
                >
                  <CollapsibleScreenTab
                    componentToggle={this.state.wouldYouRatherToggle}
                    componentPassed={this.state.wouldYouRatherPassed}
                    componentStatus={this.state.wouldYouRatherStatus}
                    componentName={"wouldYouRather"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    scrollView={this.scrollView}
                  />
                </View>

                {/*localDestination*/}
                <View
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.localDestinationPositionY = layout.y;
                  }}
                >
                  <CollapsibleScreenTab
                    componentToggle={this.state.localDestinationToggle}
                    componentPassed={this.state.localDestinationPassed}
                    componentStatus={this.state.localDestinationStatus}
                    componentName={"localDestination"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                    scrollY={this.scrollY}
                    scrollView={this.scrollView}
                  />
                </View>
                {/*Temporay solution for scrollView; without this would not scroll properly*/}
                <View style={{ padding: "100%" }} />
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
    );
  };

  loadingScreen = () => {
    //display fetching data
    return <LoadingScreen />;
  };

  render() {
    return this.state.isLoading ? this.SuccessScreen() : this.loadingScreen();
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
    ResetReduxDataAction: payload => dispatch(ResetReduxDataAction(payload)),
    SetIsContinueUserAction: payload =>
      dispatch(SetIsContinueUserAction(payload)),
    SetUserAllDataAction: payload => dispatch(SetUserAllDataAction(payload)),
    SetGUIAction: payload => dispatch(SetGUIAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollapisbleRegistration);
