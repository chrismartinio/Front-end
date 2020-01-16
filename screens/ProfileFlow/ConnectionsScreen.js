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

import LoadingScreen from "../../sharedComponents/LoadingScreen";

import {
  server_chat,
  server_pushNotification
} from "../../config/ipconfig";

import Footer from "../../sharedComponents/Footer";

//1. make an error screen for no data for profile screen and edit screen
//2. delay footer buttons
//3. fix faill storing

import { testobj } from "../../data/testObj";

class ConversationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      matchedUsersList: [],
      isSuccess: false
    };
    this.scrollY;
  }

  getMatchedUsersStatusFromDB = async guid => {
    fetch(`${server_chat}/api/chat/chatRooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userGuid: guid
      })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ matchedUsersList: res });
      })
      .catch(err => {
        console.log(err);
      });
  };

  async componentDidMount() {
    this.guid = await this.props.CreateProfileDataReducer.guid;

    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;

    await this.getMatchedUsersStatusFromDB(this.guid);

    AppState.addEventListener("change", this._handleAppStateChange);

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
      await fetch(
        `${server_pushNotification}/api/pushNotification/appState`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: { guid: this.guid, appState: "foreground" }
          })
        }
      )
        .then(() => console.log("success"))
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log("User: " + this.guid + " has gone to the background!");
      await fetch(
        `${server_pushNotification}/api/pushNotification/appState`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: { guid: this.guid, appState: "background" }
          })
        }
      )
        .then(() => console.log("success"))
        .catch(error => {
          console.log(error);
        });
    }
    this.setState({ appState: nextAppState });
  };

  successScreen = () => {
    let displayList = this.state.matchedUsersList.map((e, i = 0) => {
      return (
        <TouchableOpacity
          key={i}
          style={{
            borderColor: "black",
            borderWidth: 1,
            padding: 20,
            margin: 5,
            backgroundColor: "#fff",
            alignItems: "center",
            borderRadius: 20
          }}
          onPress={() => {
            this.props.navigation.navigate("Profile", {
              guid: e.matchedUserGuid,
              isDeviceUser: false
            });
          }}
        >
          <Text>{e.matchedUserName}</Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          <ScrollView>{displayList}</ScrollView>
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
)(ConversationsScreen);
