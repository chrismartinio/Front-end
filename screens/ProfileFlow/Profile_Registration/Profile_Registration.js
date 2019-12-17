import React, { Component } from "react";
import {
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  Dimensions
} from "react-native";

//background color
import { LinearGradient } from "expo-linear-gradient";

//Collapsible Components
import CollapsibleScreenTab from "../Profile_SharedComponents/CollapsibleScreenTab";

import LoadingScreen from "../../../sharedComponents/LoadingScreen";

var jwtDecode = require("jwt-decode");

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
import SetAboutYouDataAction from "../../../storage/actions/RegistrationActions/SetAboutYouDataAction";

//SQLite
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("that.db");

//Flow of New User:
//OAuth assign JWT ->
//OAuth send JWT which contains gui="" and checklist="default checklist" -> Profile decrypt jwt ->
//Profile retrieve guid and checklist -> user register

//Flow of New Third Party Service Providers User:
//OAuth assign JWT ->
//User uses Third -> OAuth creates profile on createAccount and aboutYou
//OAuth send JWT which contains gui="some gui", checklist = "some checklist", and isThirdPartiesServiceUser = true
//Profile decrypt jwt ->
//Profile retrieve guid and checklist -> user register

//Flow of Continue User
//OAuth assign JWT ->
//OAuth uses email/password or 3rd party to verify users and query data from db ->
//OAuth send JWT which contains gui="some gui" and checklist = "some checklist", and isThirdPartiesServiceUser = false
//Profile decrypt jwt ->
//Profile retrieve guid and checklist -> user continue register

class Profile_Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccountToggle: true, //always open when go to this screen
      aboutYouToggle: false,
      preferencesToggle: false,
      interestsToggle: false,
      wouldYouRatherToggle: false,
      localDestinationToggle: false,
      createAccountPassed: true, //
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
      isSuccess: false, //use to make sure if there data inside redux before rendering
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
    //If JWT is "", null, undefined, that user should be new user
    if (jwt === "" || jwt === null || jwt === undefined) {
      return {
        guid: "",
        checklist: {
          createAccount: false,
          aboutYou: false,
          preferences: false,
          interests: false,
          wouldYouRather: false,
          localDestination: false
        },
        isThirdPartiesServiceUser: false
      };
    }

    //Decode JWT
    var decoded = jwtDecode(jwt);
    let { guid, isThirdParty } = decoded;
    //TESTING USE
    //the checklist will be get from decoded
    let checklist = {
      createAccount: true,
      aboutYou: false,
      preferences: false,
      interests: false,
      wouldYouRather: false,
      localDestination: false
    };
    let isThirdPartiesServiceUser = isThirdParty;

    return {
      guid: guid,
      checklist: checklist,
      isThirdPartiesServiceUser: isThirdPartiesServiceUser
    };
  };

  //For Continue User Only
  setUserStatus = jwtObject => {
    //Set Redux checklist
    this.props.SetIsContinueUserAction({
      isContinueUser: true,
      checklist: jwtObject.checklist
    });

    //Set Redux guid
    this.props.SetGUIDAction({
      guid: jwtObject.guid
    });

    //Set is Third Party Services Provider User
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
    //get the guid and checklist from decrypted jwt
    let jwtObject = this.decryptJWT(this.getJWT());

    //check if the user is a continue user.
    //if there has a guid then the user is a continue user
    //if no guid then it is not a continue user
    //when user get to this screen, they must be a new usser or continue user
    //At the beginning of the Registration, if the user already has a guid
    //the user must be a continue user
    let isContinueUser = jwtObject.guid ? true : false;

    //if the user is a continue user, set isContinueUser is true in Redux
    if (isContinueUser) {
      await this.setUserStatus(jwtObject);
    }

    //Trigger render() again after guid and checklist are store into redux
    this.setState({
      isSuccess: true
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
      /*
      this.props.ResetReduxDataAction({
        reset: true
      });
      */
      this.props.navigation.navigate("Selfie", { isEdit: false });
      //Close the db?
      //db._db.close();
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

  successScreen = () => {
    return (
      <View style={{ flex: 1 }}>
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
                {/*Join Blindly Text*/}
                <View style={{ alignItems: "center" }}>
                  <View style={styles.joinBlindlyTextWrap}>
                    <Image
                      source={require("../../../assets/images/butterfly.png")}
                      style={{
                        width: 50,
                        height: 50,
                        transform: [{ rotate: "300deg" }]
                      }}
                    />
                    {/*Spaces*/}
                    <View
                      style={{
                        padding: "2%"
                      }}
                    />
                    <Text style={styles.joinBlindlyText}>Join Blindly</Text>
                  </View>
                </View>

                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                  }}
                />

                {/*Create Account*/}
                <View>
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
                <View>
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
                <View>
                  <CollapsibleScreenTab
                    componentToggle={this.state.preferencesToggle}
                    componentPassed={this.state.preferencesPassed}
                    componentStatus={this.state.preferencesStatus}
                    componentName={"preferences"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                  />
                </View>

                {/*interests*/}
                <View>
                  <CollapsibleScreenTab
                    componentToggle={this.state.interestsToggle}
                    componentPassed={this.state.interestsPassed}
                    componentStatus={this.state.interestsStatus}
                    componentName={"interests"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                  />
                </View>

                {/*wouldYouRather*/}
                <View>
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
                <View>
                  <CollapsibleScreenTab
                    componentToggle={this.state.localDestinationToggle}
                    componentPassed={this.state.localDestinationPassed}
                    componentStatus={this.state.localDestinationStatus}
                    componentName={"localDestination"}
                    handleToggle={this.handleToggle}
                    handlePassed={this.handlePassed}
                  />
                </View>
                {/*Temporay solution for scrollView; without this would not scroll properly*/}
                <View style={{ padding: "100%" }} />
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  };

  loadingScreen = () => {
    //display fetching data
    return <LoadingScreen navigation={this.props.navigation} />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.loadingScreen();
  }
}

const { height, width } = Dimensions.get("window");

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
  joinBlindlyText: {
    color: "rgb(67, 33, 140)",
    fontSize: Math.round(width / 15),
    top: 10,
    fontWeight: "500"
  },
  joinBlindlyTextWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    right: 30
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
      dispatch(SetIsThirdPartyServicesUserAction(payload)),
    SetAboutYouDataAction: payload => dispatch(SetAboutYouDataAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile_Registration);
