import React from "react";

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ImageBackground,
  TouchableHighlight,
  AppState,
  Dimensions
} from "react-native";

import { connect } from "react-redux";

import io from "socket.io-client";

import { Icon } from "react-native-elements";
import AntIcon from "react-native-vector-icons/AntDesign";

import LoadingScreen from "../sharedComponents/LoadingScreen";

import { localhost } from "../config/ipconfig";

import Footer from "../sharedComponents/Footer";

const { height, width } = Dimensions.get("window");

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      connections: 250,
      online: 13,
      isSuccess: false
    };

    //this.socket = io("http://74.80.250.210:3060");
  }

  async componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    this.guid = await this.props.CreateProfileDataReducer.guid;

    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;

    console.log("HomeScreen");
    console.log("USER GUID: ", this.guid);
    console.log("USER firstName: ", this.user_firstName);

    this.setState({
      isSuccess: true
    });
  }

  componentWillUnmount() {
    //this.socket.off();
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("User: " + this.guid + " has come to the foreground!");
      await fetch(`http://${localhost}:3020/api/pushNotification/appState`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: { guid: this.guid, appState: "foreground" }
        })
      })
        .then(() => console.log("success"))
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log("User: " + this.guid + " has gone to the background!");
      await fetch(`http://${localhost}:3020/api/pushNotification/appState`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: { guid: this.guid, appState: "background" }
        })
      })
        .then(() => console.log("success"))
        .catch(error => {
          console.log(error);
        });
    }
    this.setState({ appState: nextAppState });
  };

  successScreen = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9, alignItems: "center" }}>
          {/*Space*/}
          <View style={{ padding: "5%" }} />

          {/*Start Text*/}
          <Text
            style={{
              fontSize: 20,
              color: "#7443aa"
            }}
          >
            START
          </Text>

          {/*Butterfly Button*/}
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Matching");
            }}
          >
            <View>
              <Image
                source={require("../assets/images/butterfly.png")}
                style={{
                  width: 100,
                  height: 100,
                  margin: 25,
                  transform: [{ rotate: "300deg" }]
                }}
              />
            </View>
          </TouchableOpacity>

          {/*New Chat Text*/}
          <Text
            style={{
              fontSize: 20,
              color: "#7443aa"
            }}
          >
            NEW CHAT
          </Text>

          {/*Space*/}
          <View style={{ padding: "10%" }} />

          {/*No More Swiping Text*/}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#7443aa"
            }}
          >
            No More Swiping.
          </Text>

          {/*Space*/}
          <View style={{ padding: "2%" }} />

          {/*Long Text #1 Text*/}
          <View style={{ width: 300 }}>
            <Text
              style={{
                fontSize: 10,
                textAlign: "center",
                color: "#7443aa"
              }}
            >
              We want you to make a deeper and more significant connection by
              talking to a real person.
            </Text>
          </View>

          {/*Space*/}
          <View style={{ padding: "2%" }} />

          {/*Long Text #2 Text*/}
          <View style={{ width: 300 }}>
            <Text
              style={{
                fontSize: 10,
                textAlign: "center",
                color: "#7443aa"
              }}
            >
              Blindly will only show you what the other person looks like until
              you made a connection with them.
            </Text>
          </View>

          {/*Space*/}
          <View style={{ padding: "10%" }} />

          {/*Connection and Online*/}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: width * 0.65
            }}
          >
            {/*Connections Text*/}
            <View
              style={{
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Icon
                type="font-awesome"
                size={width * 0.06}
                name="group"
                color="#46278c"
              />
              <View style={{ padding: "5%" }} />
              <Text style={{ color: "#7443aa", fontWeight: "bold" }}>
                {this.state.connections}
              </Text>
              <View style={{ padding: "3%" }} />
              <Text style={{ color: "#7443aa" }}>Connections</Text>
            </View>

            <View
              style={{
                borderWidth: 0.5,
                borderColor: "#7443aa",
                height: 100,
                alignSelf: "center"
              }}
            />

            {/*Online Text*/}
            <View
              style={{
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <AntIcon name="earth" color="#46278c" size={width * 0.06} />

              <View style={{ padding: "10%" }} />
              <Text style={{ color: "#7443aa", fontWeight: "bold" }}>
                {this.state.online}
              </Text>
              <View style={{ padding: "5%" }} />
              <Text style={{ color: "#7443aa" }}>Online</Text>
            </View>
          </View>
        </View>

        {/*Footer*/}
        <Footer navigation={this.props.navigation} />
      </View>
    );
  };

  loadingScreen = () => {
    return <LoadingScreen navigation={this.props.navigation} />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.loadingScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  chatRoomBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    alignItems: "center",
    width: 350,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  chatRoomBoxWrap: {
    alignItems: "center"
  },
  backgroundImage: {
    height: "100%",
    width: "100%"
  },
  titleBox: {
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#BF446E"
  },
  titleText: {
    color: "#fff"
  },
  buttonStyle: {
    borderRadius: 20,
    color: "white",
    backgroundColor: "#18cdf6",
    width: 200,
    alignSelf: "center",
    marginBottom: 20,
    fontStyle: "italic"
  },
  buttonStyleOutline: {
    borderRadius: 20,
    color: "#18cdf6",
    borderWidth: 1,
    borderColor: "#18cdf6",
    width: 200,
    alignSelf: "center",
    marginBottom: 5,
    fontStyle: "italic"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
