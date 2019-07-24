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
import { connect } from "react-redux";
import SetUserDataAction from "../../storage/actions/SetUserDataAction";
import firebase from "../../utils/mainFire";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import SignupPage from "./AccordianCollapse_ScrollView/SignupPage";
import AboutYou from "./AccordianCollapse_ScrollView/AboutYou";
import ImInterestedIn from "./AccordianCollapse_ScrollView/ImInterestedIn";
import TellUsMore from "./AccordianCollapse_ScrollView/TellUsMore";
import WouldRather from "./AccordianCollapse_ScrollView/WouldRather";
import SpendWeekend from "./AccordianCollapse_ScrollView/SpendAWeekend";

import { Chevron } from "react-native-shapes";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccountScreen: false,
      aboutYouScreen: false,
      preferencesScreen: false,
      interestsScreen: false,
      wouldYouRatherScreen: false,
      localDestinationsScreen: false
    };
  }
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

  render() {
    return (
      <LinearGradient
        textStyle={{ color: "#fff" }}
        colors={["#18cdf6", "#43218c"]}
        style={{ flex: 1 }}
      >
        <ScrollView>
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
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/*Create Account*/}
                <Collapse
                  isCollapsed={this.state.createAccountScreen}
                  onToggle={createAccountScreen =>
                    this.setState({ createAccountScreen: createAccountScreen })
                  }
                >
                  >
                  <CollapseHeader>
                    <View
                      style={{
                        opacity: this.state.createAccountScreen ? 1 : 0.5
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 24 }}>
                        Create Account
                      </Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <Chevron
                          size={2}
                          rotate={this.state.createAccountScreen ? 0 : 270}
                          style={{ bottom: 15, right: 5 }}
                          color="#fff"
                        />
                      </View>
                    </View>
                  </CollapseHeader>
                  <CollapseBody>
                    <SignupPage />
                  </CollapseBody>
                </Collapse>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/*About You*/}
                <Collapse
                  isCollapsed={this.state.aboutYouScreen}
                  onToggle={aboutYouScreen =>
                    this.setState({ aboutYouScreen: aboutYouScreen })
                  }
                >
                  <CollapseHeader>
                    <View
                      style={{
                        opacity: this.state.aboutYouScreen ? 1 : 0.5
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 24 }}>
                        About you
                      </Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <Chevron
                          size={2}
                          style={{ bottom: 15, right: 5 }}
                          rotate={this.state.aboutYouScreen ? 0 : 270}
                          color="#fff"
                        />
                      </View>
                    </View>
                  </CollapseHeader>
                  <CollapseBody>
                    <SignupPage />
                  </CollapseBody>
                </Collapse>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/*Preferences*/}
                <Collapse
                  isCollapsed={this.state.preferencesScreen}
                  onToggle={preferencesScreen =>
                    this.setState({ preferencesScreen: preferencesScreen })
                  }
                >
                  <CollapseHeader>
                    <View
                      style={{
                        opacity: this.state.preferencesScreen ? 1 : 0.5
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 24 }}>
                        Preferences
                      </Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <Chevron
                          size={2}
                          rotate={this.state.preferencesScreen ? 0 : 270}
                          style={{ bottom: 15, right: 5 }}
                          color="#fff"
                        />
                      </View>
                    </View>
                  </CollapseHeader>
                  <CollapseBody>
                    <SignupPage />
                  </CollapseBody>
                </Collapse>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/*Interests*/}
                <Collapse
                  isCollapsed={this.state.interestsScreen}
                  onToggle={interestsScreen =>
                    this.setState({ interestsScreen: interestsScreen })
                  }
                >
                  <CollapseHeader>
                    <View
                      style={{
                        opacity: this.state.interestsScreen ? 1 : 0.5
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 24 }}>
                        Interests
                      </Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <Chevron
                          size={2}
                          rotate={this.state.interestsScreen ? 0 : 270}
                          style={{ bottom: 15, right: 5 }}
                          color="#fff"
                        />
                      </View>
                    </View>
                  </CollapseHeader>
                  <CollapseBody>
                    <SignupPage />
                  </CollapseBody>
                </Collapse>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/*Would You Rather*/}
                <Collapse
                  isCollapsed={this.state.wouldYouRatherScreen}
                  onToggle={wouldYouRatherScreen =>
                    this.setState({
                      wouldYouRatherScreen: wouldYouRatherScreen
                    })
                  }
                >
                  <CollapseHeader>
                    <View
                      style={{
                        opacity: this.state.wouldYouRatherScreen ? 1 : 0.5
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 24 }}>
                        Would you rather
                      </Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <Chevron
                          size={2}
                          rotate={this.state.wouldYouRatherScreen ? 0 : 270}
                          style={{ bottom: 15, right: 5 }}
                          color="#fff"
                        />
                      </View>
                    </View>
                  </CollapseHeader>
                  <CollapseBody>
                    <SignupPage />
                  </CollapseBody>
                </Collapse>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
                />

                {/*Local Destinations*/}
                <Collapse
                  isCollapsed={this.state.localDestinationsScreen}
                  onToggle={localDestinationsScreen =>
                    this.setState({
                      localDestinationsScreen: localDestinationsScreen
                    })
                  }
                >
                  <CollapseHeader>
                    <View
                      style={{
                        opacity: this.state.localDestinationsScreen ? 1 : 0.5
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 24 }}>
                        Local Destinations
                      </Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <Chevron
                          size={2}
                          rotate={this.state.localDestinationsScreen ? 0 : 270}
                          style={{ bottom: 15, right: 5 }}
                          color="#fff"
                        />
                      </View>
                    </View>
                  </CollapseHeader>
                  <CollapseBody>
                    <SignupPage />
                  </CollapseBody>
                </Collapse>
                {/*Spaces*/}
                <View
                  style={{
                    padding: "10%"
                    //borderRadius: 4,
                    //borderWidth: 0.5,
                    //borderColor: "#d6d7da"
                  }}
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

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetUserDataAction: payload => dispatch(SetUserDataAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
