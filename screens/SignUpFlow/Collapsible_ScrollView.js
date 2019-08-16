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
  ImageBackground,
  Separator,
  Thumbnail,
  List,
  ListItem
} from "react-native";
import { LinearGradient } from "expo";
import CollapseComponent from "./Collapsible_ScrollView_Components/TinyComponents/CollapseComponenet.js";

import { connect } from "react-redux";
import ResetReduxData from "../../storage/actions/ResetReduxData";

import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

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
      currentScreenTopY: 0 //screenTopY : slide down increase ; slide up decrease
    };
    this.interestsPositionY = 0;
    this.localDestinationsPositionY = 0;
    this.preferencesPositionY = 0;

    //when the user click signup button in homescreen,
    //it will call onAuth api to check if account already exist
    //if Yes, go to login
    //if no , generate an hash id and send to onboarding
    //If account exist but not finish, also send to onboarding

    //Prevent User to re-submit different if their account is undone
    this.undone = false;
  }

  componentDidMount() {

    fetch("http://74.80.250.210:5000/dbRouter/userProfileUndoneQuery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "bbb@live.com",
        password: "12345Abc",
        collectionName: "createAccount",
      })
    })
      .then(res => res.json())
      .then(res => {
        let object = JSON.parse(JSON.stringify(res));
        console.log(object);
      })
      .catch(function(error) {
        console.error(error.message);
        throw error;
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
                <CollapseComponent
                  componentToggle={this.state.createAccountToggle}
                  componentPassed={this.state.createAccountPassed}
                  componentName={"createAccount"}
                  handleToggle={this.handleToggle}
                  handlePassed={this.handlePassed}
                  undone={this.undone}
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
    );
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
    ResetReduxData: payload => dispatch(ResetReduxData(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Collapsible_ScrollView);
