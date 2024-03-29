import React from "react";

import {
  Image,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  ImageBackground,
  Modal,
  TouchableHighlight,
  AppState,
  Dimensions,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { connect } from "react-redux";

import io from "socket.io-client";

import LoadingScreen from "../../sharedComponents/LoadingScreen";
import MeetupMenu from "./Chat_SharedComponents/MeetupMenu";

import InputMenu from "./Chat_SharedComponents/InputMenu";

import { server_chat, server_report } from "../../config/ipconfig";

const { height, width } = Dimensions.get("window");

import { testobj } from "../../data/testObj";

import { Icon } from "react-native-elements";

import { StackActions, NavigationActions } from "react-navigation";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Constants from "expo-constants";

//Flow of get to this screen
//#1
//LoginScreen.js -> HomeScreen.js -> ConversationsScreen.js -> PermanentChatRoomScreen.js

//#2
//LoginScreen.js -> HomeScreen.js -> MatchingScreen.js -> FoundaMatchScreen.js ->
//MinuteChatRoomScreen.js -> AcceptMatchingScreen.js -> PermanentChatRoomScreen.js

//Because this is navigation stack, previous screen won't call componentWillUnmount, so won't close socket
//this.socket.close();
//Device user presses Alert -> ghostAlert -> ghostUser -> Home
//Match user presses Back/Alert -> this.socket.on("ghostChat") -> componentDidUpdate -> backToHome -> Home

class PermanentChatRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button title="Menu" onPress={navigation.getParam("openMenu")} />
      ),
      headerLeft: (
        <Button
          title="Back"
          onPress={() => {
            const resetConversationsAction = StackActions.reset({
              index: 1,
              actions: [
                NavigationActions.navigate({ routeName: "Home" }),
                NavigationActions.navigate({
                  routeName: "Conversations"
                })
              ]
            });
            navigation.dispatch(resetConversationsAction);
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      currentMessage: "",
      isSuccess: false,
      isTyping: false,
      appState: AppState.currentState,
      endTime: "",
      modalVisible: false,
      matchUserGuid: "",
      matchFirstName: "",
      matchLikesArray: [],
      matchAge: "",
      matchCity: "",
      matchState: "",
      keyBoardShown: false,
      matchInfoToggle: true,
      matchImageUrl:
        "https://cdn.pixabay.com/photo/2016/03/31/15/33/contact-1293388_960_720.png",
      isMatchUserAccept: false,
      isMatchUserClicked: false
    };
    this.roomGuid = this.props.navigation.state.params.matchRoomGuid;
    this.token = "";
    //this.socket = io(`${server_chat}/${this.roomGuid}`, {
    this.socket = io(`${server_chat}/${this.roomGuid}`, {
      forceNew: true,
      transportOptions: {
        polling: {
          extraHeaders: {
            authorization: "Bearer " + this.token // if you have token for auth
          }
        }
      },
      query: {
        namespace: this.roomGuid
      }
    });

    //handle new message
    this.socket.on("new message", data => {
      let str = data.message;
      this.addChatMessage(2, str, data.username);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle user joined
    this.socket.on("user joined", data => {
      this.matched_user_firstName = data.username;
      let str = `${data.username} has joined`;
      this.addChatMessage(3, str, data.username);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle user left
    this.socket.on("user left", data => {
      let str = `${data.username} has left`;
      this.addChatMessage(3, str, data.username);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle user typingaddChatMessage
    this.socket.on("typing", data => {
      if (this.matched_user_firstName === "") {
        this.matched_user_firstName = data.username;
      }
      this.setState({
        isTyping: true
      });
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle user not typing
    this.socket.on("stop typing", data => {
      this.setState({
        isTyping: false
      });
    });

    //handle disconnect
    this.socket.on("disconnect", () => {
      let str = "you have lost connection to the server";
      this.addChatMessage(3, str, this.user_firstName);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle reconnect
    this.socket.on("reconnect", () => {
      this.socket.emit("add user", this.user_firstName);
      let str = "you have been reconnected to the server";
      this.addChatMessage(3, str, this.user_firstName);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle ghost
    this.socket.on("ghostChat", () => {
      console.log("Perm");
      if (Constants.isDevice) {
        console.log("===phone===");
      } else {
        console.log("===simulator===");
      }

      this.setState({ isMatchUserClicked: true, isMatchUserAccept: false });
    });
  }

  formatOldMessage = messagesArray => {
    let temp = [];
    for (let i = 0; i < messagesArray.length; i++) {
      temp.push({
        type: messagesArray[i].userGuid === this.userGuid ? 1 : 2,
        message: messagesArray[i].message,
        userName:
          messagesArray[i].userGuid === this.userGuid
            ? this.user_firstName
            : this.state.matchFirstName,
        timeStamp: this.oldMessagetimeStamp(messagesArray[i].date)
      });
    }
    this.setState({
      allMessages: temp
    });
  };

  getOldMessageFromDB = async roomGuid => {
    await fetch(`${server_chat}/api/chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        roomGuid: roomGuid
      })
    })
      .then(res => res.json())
      .then(res => {
        this.formatOldMessage(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  setMatchedUserInfo = ({
    matchUserGuid,
    matchRoomGuid,
    matchFirstName,
    matchLastName,
    matchLikesArray,
    matchImageUrl,
    matchMiles,
    matchAge,
    matchCity,
    matchState
  }) => {
    this.setState({
      matchUserGuid: matchUserGuid,
      matchRoomGuid: matchRoomGuid,
      matchFirstName: matchFirstName,
      matchLastName: matchLastName,
      matchLikesArray: matchLikesArray,
      matchImageUrl: matchImageUrl,
      matchMiles: matchMiles,
      matchAge: matchAge,
      matchCity: matchCity,
      matchState: matchState
    });
  };

  async componentDidMount() {
    //Matched Info
    this.setMatchedUserInfo(this.props.navigation.state.params);

    //Device's user Info
    this.userGuid = await this.props.CreateProfileDataReducer.guid;
    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;
    this.user_imageUrl = await this.props.CreateProfileDataReducer
      .deviceUserImageUrl;

    //Setup RoomGuid
    this.roomGuid = this.props.navigation.state.params.matchRoomGuid;

    //call old messages
    this.getOldMessageFromDB(this.roomGuid);

    //Keyboard
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
    AppState.addEventListener("change", this._handleAppStateChange);

    //open menu
    this.props.navigation.setParams({
      openMenu: () => {
        this.openMenu(true);
      }
    });

    //emit an event to tell the socket the user has enter the room
    this.socket.emit("add user", {
      userGuid: this.userGuid,
      user_firstName: this.user_firstName
    });

    //scroll to end at the beginning
    setTimeout(() => {
      this.scrollView.scrollToEnd({ animated: false });
    }, 50);

    this.setState({
      isSuccess: true
    });
  }

  _keyboardDidShow = () => {
    this.setState({
      keyBoardShown: true
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      keyBoardShown: false
    });
  };

  openMenu = visible => {
    this.setState({ modalVisible: visible });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.currentMessage !== prevState.currentMessage) {
      if (this.state.currentMessage) {
        //if there has message on the chat box
        this.socket.emit("typing");
      } else {
        //if there has no message on the chat box
        this.socket.emit("stop typing");
      }
    }

    if (
      prevState.isMatchUserAccept !== this.state.isMatchUserAccept ||
      prevState.isMatchUserClicked !== this.state.isMatchUserClicked
    ) {
      if (
        this.state.isMatchUserAccept === false &&
        this.state.isMatchUserClicked
      ) {
        console.log("Match Reject");
        return this.backToHome();
      }
    }
  }

  backToHome = () => {
    console.log("Back to HomeScreen.js");
    Alert.alert(
      "Ops!",
      `${
        this.state.matchFirstName
      } Blocked you! You will be return to Home Screen.`,
      [
        {
          text: "OK",
          onPress: () => {
            this.socket.close();
            this.props.navigation.navigate("Home");
          }
        }
      ],
      { cancelable: false }
    );
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    AppState.removeEventListener("change", this._handleAppStateChange);
    this.socket.close();
  }

  _handleAppStateChange = nextAppState => {
    this.setState({ appState: nextAppState });
  };

  timeStamp = () => {
    let date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  oldMessagetimeStamp = time => {
    let date = new Date(time);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  //add a new message into the allMessageArray
  addChatMessage = (type, message, username) => {
    let allMessages = this.state.allMessages;
    allMessages.push({
      type: type,
      message: message,
      userName: username,
      timeStamp: this.timeStamp()
    });
    this.setState({
      allMessages: allMessages
    });
  };

  //user send a message
  submitMessage = () => {
    let str = this.state.currentMessage;
    if (this.state.currentMessage === "") {
      return;
    }
    this.addChatMessage(1, str, this.user_firstName);
    this.socket.emit("new message", {
      userGuid: this.userGuid,
      userName: this.user_firstName,
      matchedUserGuid: this.state.matchUserGuid,
      message: this.state.currentMessage,
      roomGuid: this.matchRoomGuid
    });
    this.setState({
      currentMessage: ""
    });
    this.scrollView.scrollToEnd({ animated: true });
  };

  reportUser = () => {
    fetch(`${server_report}/api/report/reportUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reportData: {
          userGuid: this.props.CreateProfileDataReducer.guid,
          matchedUserGuid: this.state.matchUserGuid,
          roomGuid: this.roomGuid
        }
      })
    })
      .then(res => {
        console.log(res);
        return res;
      })
      .then(res => res.json())
      .then(res => {
        this.formatOldMessage(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  reportAlert = () => {
    Alert.alert(
      "Warning!",
      "Are you sure you want to report? You may ghost this user after reporting them if you like.",
      [
        {
          text: "Yes",
          onPress: () => {
            this.reportUser();
          }
        },
        {
          text: "No",
          onPress: () => {},
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  messageType = (messageItem, index) => {
    //1 - device user message
    //2 - matched user message
    //3 - Status message
    switch (messageItem.type) {
      case 1:
        return (
          <View key={index} style={styles.deviceUserMessageView}>
            <View style={styles.textContainer}>
              <View style={styles.deviceUserMessageTextWrap}>
                <View style={styles.deviceUserMessageText}>
                  <Text>{`${messageItem.message}`}</Text>
                  <Text style={styles.dateTime}>{`${
                    messageItem.timeStamp
                  }`}</Text>
                </View>
              </View>
              <Image
                source={{
                  //Change this to selfimage
                  uri: this.user_imageUrl
                }}
                style={styles.selfMessageIcon}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <TouchableHighlight
            onLongPress={this.reportAlert}
            underlayColor="transparent"
            key={index}
          >
            <View style={styles.textContainer}>
              <Image
                source={{
                  uri: this.state.matchImageUrl
                }}
                style={styles.matchMessageIcon}
              />
              <View style={styles.targetMessageTextWrap}>
                <View style={styles.targetMessageText}>
                  <Text>{`${messageItem.message}`}</Text>
                  <Text style={styles.dateTimeLeft}>{`${
                    messageItem.timeStamp
                  }`}</Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        );

      case 3:
        return (
          <View key={index} style={{ alignItems: "center" }}>
            <Text>{`${messageItem.message}\n`}</Text>
          </View>
        );

      default:
        return null;
    }
  };

  onChangeText = currentMessage => {
    this.setState({ currentMessage });
  };

  ghostAlert = () => {
    Alert.alert(
      "Warning!",
      "Are you sure you want to ghost your match user",
      [
        {
          text: "Yes",
          onPress: () => {
            this.ghostUser();
          }
        },
        {
          text: "No",
          onPress: () => {},
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  ghostUser = () => {
    console.log("ghost user");
    this.socket.emit("vote", {
      voteData: "ghost",
      userGuid: this.props.CreateProfileDataReducer.guid,
      matchedUserGuid: this.state.matchUserGuid
    });
    Alert.alert(
      "Success!",
      "Your ghosted match user. You will be return to Home.",
      [
        {
          text: "OK",
          onPress: () => {
            this.socket.close();
            this.props.navigation.navigate("Home");
          }
        }
      ],
      { cancelable: false }
    );
  };

  successScreen = () => {
    let displayAllChatMessage = this.state.allMessages.map(
      (messageItem, index = 0) => {
        return this.messageType(messageItem, index);
      }
    );

    let displayMatchedLikesArray = this.state.matchLikesArray.map(
      (e, index = 0) => {
        return (
          <View key={index++}>
            <TouchableOpacity style={styles.likeButtonWrap}>
              <Text style={styles.likeButton}>#{e}</Text>
            </TouchableOpacity>
          </View>
        );
      }
    );

    let matchedInfoToggle = (
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={() => {
          this.setState({
            matchInfoToggle: !this.state.matchInfoToggle
          });
        }}
      >
        {
          <Icon
            type="font-awesome"
            name={this.state.matchInfoToggle ? "caret-down" : "caret-up"}
            size={25}
            color="gray"
          />
        }
      </TouchableOpacity>
    );

    let matchedInfo = this.state.matchInfoToggle && (
      <View>
        <View style={{ alignItems: "center" }}>
          <Text>
            {this.state.matchAge}, {this.state.matchCity}{" "}
            {this.state.matchState}
          </Text>
        </View>

        {/*Matched LikesArray*/}
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", margin: "3%" }}>
            {displayMatchedLikesArray}
          </View>
        </View>
      </View>
    );

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <View style={{ backgroundColor: "#fff" }}>
            {/*Matched Image*/}
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.ghostAlert();
                }}
              >
                <View
                  style={{
                    top: 30,
                    left: 10,
                    backgroundColor: "#4b1792",
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    borderWidth: 1,
                    borderRadius: 25,
                    borderColor: "#4b1792"
                  }}
                >
                  <FontAwesome5
                    color={"white"}
                    name={"ghost"}
                    size={width * 0.09}
                    solid
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Profile", {
                    guid: this.state.matchUserGuid,
                    isDeviceUser: false
                  });
                }}
              >
                <Image
                  source={{
                    uri: this.state.matchImageUrl
                  }}
                  style={{
                    width: width * 0.2,
                    height: width * 0.2,
                    borderRadius: width * 0.098
                  }}
                />
              </TouchableOpacity>
              <View style={{ padding: 27 }} />
            </View>
          </View>

          {/*Matched Info*/}
          {matchedInfoToggle}

          {matchedInfo}

          <View style={{ borderWidth: 2, borderColor: "purple" }} />

          {/*Messages*/}
          <ScrollView
            style={{ backgroundColor: "#d6f5f5" }}
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            //contentInset={{ top: 0, left: 0, bottom: 50, right: 0 }}
            //keyboardDismissMode={"on-drag"}
            //contentContainerStyle={styles.contentContainer}
            //paddingVertical= {-20}
          >
            <View style={{ margin: "3%" }}>{displayAllChatMessage}</View>

            {this.state.isTyping && (
              <View style={styles.textContainer}>
                <Text style={styles.matchMessageIcon}>
                  {this.matched_user_firstName}
                </Text>
                <Text style={styles.targetMessageText}>is typing...</Text>
              </View>
            )}
          </ScrollView>

          <InputMenu
            currentMessage={this.state.currentMessage}
            onChangeText={this.onChangeText}
            submitMessage={this.submitMessage}
          />

          {this.state.keyBoardShown && <View style={{ padding: "13%" }} />}

          {/*Menu POP UP*/}
          <MeetupMenu
            modalVisible={this.state.modalVisible}
            openMenu={this.openMenu}
            navigation={this.props.navigation}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    //alignItems: "flex-end",
  },
  textContainer: {
    margin: 10,
    //overflow: "hidden",
    flexDirection: "row"
  },
  scrollViewStyle: {
    marginBottom: 25
  },
  contentContainerStyle: {
    marginBottom: 25,
    paddingVertical: 200
  },
  dateTime: {
    fontSize: 8,
    textAlign: "right"
  },
  dateTimeLeft: {
    fontSize: 8,
    textAlign: "left"
  },
  deviceUserMessageText: {
    overflow: "hidden",
    borderRadius: 5,
    minWidth: 50,
    maxWidth: 300,
    borderColor: "#3399ff",
    backgroundColor: "#fff",
    color: "#fff",
    padding: 5
  },
  deviceUserMessageTextWrap: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: -5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5
      },
      android: {
        elevation: 5
      }
    })
  },
  targetMessageText: {
    overflow: "hidden",
    borderRadius: 5,
    minWidth: 50,
    maxWidth: 300,
    borderColor: "#cccccc",
    backgroundColor: "#cccccc",
    color: "#000",
    padding: 5
  },
  targetMessageTextWrap: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5
      },
      android: {
        elevation: 5
      }
    })
  },
  deviceUserName: {
    overflow: "hidden",
    padding: 15,
    borderRadius: 40,
    backgroundColor: "#00ff00",
    color: "#000"
  },
  messageInputStyle: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
    margin: 5
  },
  selfMessageIcon: {
    marginLeft: 5,
    overflow: "hidden",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    paddingTop: 7
  },
  matchMessageIcon: {
    marginRight: 5,
    overflow: "hidden",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    paddingTop: 7
  },
  deviceUserMessageView: {
    alignItems: "flex-end"
  },
  typingIndicator: {
    fontStyle: "italic"
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1
  },
  likeButtonWrap: {
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7.5,
    paddingBottom: 7.5,
    width: "auto",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgb(67, 33, 140)",
    margin: 5
  },
  likeButton: {
    color: "rgb(67, 33, 140)",
    fontSize: 17
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
)(PermanentChatRoomScreen);
