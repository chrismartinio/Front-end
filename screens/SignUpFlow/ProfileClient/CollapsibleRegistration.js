import React, { Component } from "react";
import { AsyncStorage } from "react-native";
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
import SetGUIDAction from "../../../storage/actions/RegistrationActions/SetGUIDAction";
import SetIsThirdPartyServicesUserAction from "../../../storage/actions/RegistrationActions/SetIsThirdPartyServicesUserAction";

//direction: decrypt jwt -> retrieve guid and checklist -> store guid into redux ->

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
      createAccountPassed: true, //true or false
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
      isLoading: false, //use to make sure if there data inside redux before rendering
      scrollY: 0
    };
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

    //For demo use only
    //make the jwt has something to prevent jwt === ""
    //jwt = true;
    jwt = "";
    //For demo use only

    //If some cases that the jwt is empty, then return as a new User
    //New user
    if (jwt === "") {
      return {
        guid: "",
        checklist: {
          createAccount: true,
          aboutYou: false,
          preferences: false,
          interests: false,
          wouldYouRather: false,
          localDestination: false
        },
        isThirdPartiesServiceUser: false
      };
    }
    //local stroage (asyncStorage) all "login" user except non-approve user

    //assume we decrypted the jwt and retrieve the guid and checklist
    let guid = "";
    let checklist = {
      createAccount: true,
      aboutYou: false,
      preferences: false,
      interests: false,
      wouldYouRather: false,
      localDestination: false
    };
    let isThirdPartiesServiceUser = false;

    //New User
    //guid = "";
    /*
    checklist = {
      createAccount: true,
      aboutYou: false,
      preferences: false,
      interests: false,
      wouldYouRather: false,
      localDestination: false
    };
    */
    //isThirdPartiesServiceUser = false;

    //Continue User or Third Parties Services User
    //For Third Parties Services User - since onAuth would store those user to db
    //when onAuth pass the user (guid) to profile, they are similar with Continue User
    guid = "5da2734e97849e3355767dd9";
    checklist = {
      createAccount: true,
      aboutYou: false,
      preferences: false,
      interests: false,
      wouldYouRather: false,
      localDestination: false
    };
    isThirdPartiesServiceUser = false; //set true if third parties user

    //third party services user (goal: query from db )
    //checklist (true) and isThirdPartiesServiceUser (true), it would query from db
    //checklist (false) and isThirdPartiesServiceUser (true), it would query from db as a ThirdPartiesServiceUser
    //checklist (true) and isThirdPartiesServiceUser (false), it would query from db as a continue user (screen filled before)
    //checklist (false) and isThirdPartiesServiceUser (false), it would not query from db as a continue user (screen not filled before)

    //rare error: if db data and checklist are not match
    //let say aboutYou data is null but checklist[1] = true,
    //Because of checklist[1] is true, the screen would try to retrieve data
    //However, since aboutYou data is null, then the screen will fetch a null object
    //The screen call object.result.firstname; object is null, this will create a error
    //error get throw and call the failscreen forever; make sure checklist and db data is match

    return {
      guid: guid,
      checklist: checklist,
      isThirdPartiesServiceUser: isThirdPartiesServiceUser
    };
  };

  setUserStatus = jwtObject => {
    //Set the user as continue user in redux
    //Store the checklist in redux
    this.props.SetIsContinueUserAction({
      isContinueUser: true,
      checklist: jwtObject.checklist
    });

    //Pass guid into redux
    this.props.SetGUIDAction({
      guid: jwtObject.guid
    });

    //Set third party services user
    this.props.SetIsThirdPartyServicesUserAction({
      isThirdPartiesServiceUser: jwtObject.isThirdPartiesServiceUser
    });

    //Set the status for screen
    this.setState({
      createAccountPassed: jwtObject.checklist.createAccount,
      aboutYouPassed: jwtObject.checklist.aboutYou,
      preferencesPassed: jwtObject.checklist.preferences,
      interestsPassed: jwtObject.checklist.interests,
      wouldYouRatherPassed: jwtObject.checklist.wouldYouRather,
      localDestinationPassed: jwtObject.checklist.localDestination,
      createAccountStatus: "passed", //isContinueUser always true for createAccountStatus
      aboutYouStatus: jwtObject.checklist.aboutYou ? "passed" : "empty",
      preferencesStatus: jwtObject.checklist.preferences ? "passed" : "empty",
      interestsStatus: jwtObject.checklist.interests ? "passed" : "empty",
      wouldYouRatherStatus: jwtObject.checklist.wouldYouRather
        ? "passed"
        : "empty",
      localDestinationStatus: jwtObject.checklist.localDestination
        ? "passed"
        : "empty"
    });
  };

  async componentDidMount() {
    //a warning that if checklist is [true, true, true, true, true, true]
    //Since Auth will handle if the checklist is a continue user or new user
    //continue user : [true, false, false, true, true, true]
    //new user : [true, false, false, false, false, false]
    //third parties user / continue user : [true, true, false, false, false, false]
    //If [true, true, true, true, true, true], Auth will pass user to profile instead of registration

    //get the guid and checklist from decrypted jwt
    let jwtObject = this.decryptJWT(this.getJWT());

    //check if the user is a continue user.
    //if there has a guid then the user is a continue user
    //if no guid then it is not a continue user
    let isContinueUser = jwtObject.guid ? true : false;
    //Note
    //if new user sumbitted createAccount, they become a continue user?
    //yes,
    //won't the rest of the screen say because it is a continue user, then query the data?
    //no, the rest of the screen won't query data because
    //we only assign the user is continue User after the user get in to registration screen
    //instead of after the user submitted createAccount screen
    //For example, continue user
    //CollaspibleRegistration.js get guid = "something", checklist = [true, false, false, false, false, false]
    //it will mark isContinueUser = true, the rest of the screen will query data

    //For example, new user
    //CollaspibleRegistration.js get guid = "", checklist = [true, false, false, false, false, false]
    //it will mark isContinueUser = false, the rest of the screen will not query data
    //createAccount.js get the isContinueUser === false, so it won't query data
    //aboutYou.js get the isContinueUser === false, so it won't query data

    //if the user is a continue user, set isContinueUser is true in Redux
    if (isContinueUser) {
      await this.setUserStatus(jwtObject);
    }

    //Trigger render() again after guid and checklist are store into redux
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
      //Handle Duplicate Email; let the createAccount screen stay remain
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
            y: this.state.scrollY + pageY - offset,
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
    this.setState({
      scrollY: contentOffset.y
    });
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
                    otherToggle={[
                      this.state.createAccountToggle,
                      this.state.aboutYouToggle
                    ]}
                    scrollY={this.state.scrollY}
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
                    otherToggle={[
                      this.state.createAccountToggle,
                      this.state.aboutYouToggle,
                      this.state.preferencesToggle
                    ]}
                    scrollY={this.state.scrollY}
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
                    otherToggle={[
                      this.state.createAccountToggle,
                      this.state.aboutYouToggle,
                      this.state.preferencesToggle,
                      this.state.interestsToggle,
                      this.state.wouldYouRatherToggle
                    ]}
                    scrollY={this.state.scrollY}
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
    SetGUIDAction: payload => dispatch(SetGUIDAction(payload)),
    SetIsThirdPartyServicesUserAction: payload =>
      dispatch(SetIsThirdPartyServicesUserAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollapisbleRegistration);
