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

import { Chevron } from "react-native-shapes";
import { Icon, Input } from "react-native-elements";

class Collapsible_ScrollView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccountToggle: false,
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
      localDestinationsPassed: false
    };
    //current Screen Top Y
    //set to 0 by default
    //scroll to bottom will increase
    this.currentScreenTopY = 0;
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
      this.props.navigation.navigate("TestRegistrationComplete");
    }
  };

  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };
  static navigationOptions = {
    //header: null,
    //title: 'Match Chat',
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

  //When ComponentName/Arrow is pressed, Toggle its states
  handleToggle = (componentName, evt) => {
    let pageY;
    evt === null || evt === undefined ? pageY = 150 : pageY = evt.nativeEvent.pageY;
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
  //If true, give it a check mark
  //If false, remove the check mark
  handlePassed = (componentName, passed) => {
    let passName = componentName + "Passed";
    if (passed) {
      this.setState(
        {
          [passName]: true
        },
        () => {
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
    this.currentScreenTopY = contentOffset.y;
    //console.log(this.currentScreenTopY);
  };

  //Press tab will scroll to that tab position
  scrollToPosition = (componentName, tabPageY) => {
    let offset;
    componentName === "createAccount" ? (offset = 250) : (offset = 150);
    const newScrollY = this.currentScreenTopY + tabPageY - offset;
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
                    padding: "10%"
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
                <CollapseComponent
                  componentToggle={this.state.preferencesToggle}
                  componentPassed={this.state.preferencesPassed}
                  componentName={"preferences"}
                  handleToggle={this.handleToggle}
                  handlePassed={this.handlePassed}
                />

                {/*interests*/}
                <CollapseComponent
                  componentToggle={this.state.interestsToggle}
                  componentPassed={this.state.interestsPassed}
                  componentName={"interests"}
                  handleToggle={this.handleToggle}
                  handlePassed={this.handlePassed}
                />

                {/*wouldYouRather*/}
                <CollapseComponent
                  componentToggle={this.state.wouldYouRatherToggle}
                  componentPassed={this.state.wouldYouRatherPassed}
                  componentName={"wouldYouRather"}
                  handleToggle={this.handleToggle}
                  handlePassed={this.handlePassed}
                />

                {/*localDestinations*/}
                <CollapseComponent
                  componentToggle={this.state.localDestinationsToggle}
                  componentPassed={this.state.localDestinationsPassed}
                  componentName={"localDestinations"}
                  handleToggle={this.handleToggle}
                  handlePassed={this.handlePassed}
                />
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

export default Collapsible_ScrollView;
