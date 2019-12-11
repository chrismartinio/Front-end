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
  AppState
} from "react-native";

import { connect } from "react-redux";

import io from "socket.io-client";

import LoadingScreen from "../sharedComponents/LoadingScreen";

import { localhost } from "../config/ipconfig";

import Footer from "../sharedComponents/Footer";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,

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
        <View style={{ flex: 0.9 }}>
          <Button
            color={"white"}
            title={"matching"}
            onPress={() => {
              this.props.navigation.navigate("Matching");
            }}
          />
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
    backgroundColor: "#4d88ff"
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
