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
  TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo";
import SignUpPage from "./CollapsibleTesting/SignUpPage.js";
import AboutYou from "./CollapsibleTesting/AboutYou.js";
import WouldRather from "./CollapsibleTesting/WouldRather.js";
import TellUsMore from "./CollapsibleTesting/TellUsMore.js";
import SpendAWeekend from "./CollapsibleTesting/SpendAWeekend.js";
import ImInterestedIn from "./CollapsibleTesting/ImInterestedIn.js";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      s1: true,
      s2: false,
      s3: false,
      s4: false,
      s5: false,
      s6: false
    };
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <LinearGradient
          textStyle={{ color: "#fff" }}
          colors={["#18cdf6", "#43218c"]}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inner}>
                {/*Sign Up */}
                <View alignItems="center">
                  <TouchableOpacity
                    style={styles.screenTab}
                    onPress={() => {
                      this.setState({
                        s1: !this.state.s1
                      });
                    }}
                  >
                    <Text style={styles.button}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
                {this.state.s1 && <SignUpPage />}

                {/*About You */}
                <View alignItems="center">
                  <TouchableOpacity
                    style={styles.screenTab}
                    onPress={() => {
                      this.setState({
                        s2: !this.state.s2
                      });
                    }}
                  >
                    <Text style={styles.button}>About You</Text>
                  </TouchableOpacity>
                </View>
                {this.state.s2 && <AboutYou />}

                {/*Would Rather*/}
                <View alignItems="center">
                  <TouchableOpacity
                    style={styles.screenTab}
                    onPress={() => {
                      this.setState({
                        s3: !this.state.s3
                      });
                    }}
                  >
                    <Text style={styles.button}>Would Rather</Text>
                  </TouchableOpacity>
                </View>
                {this.state.s3 && <WouldRather />}

                {/*Tell Us More*/}
                <View alignItems="center">
                  <TouchableOpacity
                    style={styles.screenTab}
                    onPress={() => {
                      this.setState({
                        s4: !this.state.s4
                      });
                    }}
                  >
                    <Text style={styles.button}>Tell Us More</Text>
                  </TouchableOpacity>
                </View>
                {this.state.s4 && <TellUsMore />}

                {/*SpendAWeekend*/}
                <View alignItems="center">
                  <TouchableOpacity
                    style={styles.screenTab}
                    onPress={() => {
                      this.setState({
                        s5: !this.state.s5
                      });
                    }}
                  >
                    <Text style={styles.button}>SpendAWeekend</Text>
                  </TouchableOpacity>
                </View>
                {this.state.s5 && <SpendAWeekend />}

                {/*ImInterestedIn*/}
                <View alignItems="center">
                  <TouchableOpacity
                    style={styles.screenTab}
                    onPress={() => {
                      this.setState({
                        s6: !this.state.s6
                      });
                    }}
                  >
                    <Text style={styles.button}>ImInterestedIn</Text>
                  </TouchableOpacity>
                </View>
                {this.state.s6 && <TellUsMore />}
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </LinearGradient>
      </KeyboardAvoidingView>
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
    justifyContent: "flex-start"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  input: {
    height: 40,
    borderColor: "#fff",
    color: "#fff",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  },
  button: {
    color: "#fff"
  },
  screenTab: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 10,
    //borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "110%"
  }
});

export default Welcome;
