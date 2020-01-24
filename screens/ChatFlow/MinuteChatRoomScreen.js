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
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";

import io from "socket.io-client";

import LoadingScreen from "../../sharedComponents/LoadingScreen";

import InputMenu from "./Chat_SharedComponents/InputMenu";

import { server_chat } from "../../config/ipconfig";

const { height, width } = Dimensions.get("window");

import { testobj } from "../../data/testObj";

import { Icon } from "react-native-elements";

//Flow of get to this screen
//#1
//LoginScreen.js -> HomeScreen.js -> MatchingScreen.js -> FoundaMatchScreen.js ->
//MinuteChatRoomScreen.js

class MinuteChatRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      /*
      headerLeft: () => (
        <Button title="Exit" onPress={navigation.getParam("openMenu")} />
      )
      */
      headerLeft: null
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      currentMessage: "",
      isSuccess: false,
      isTyping: false,
      countDownSecond: 90,
      appState: AppState.currentState,
      counting: false,
      endTime: "",
      modalVisible: false,
      matchUserGuid: "",
      matchFirstName: "",
      matchLastName: "",
      matchLikesArray: [],
      matchImageUrl:
        "https://cdn.pixabay.com/photo/2016/03/31/15/33/contact-1293388_960_720.png",
      matchAge: "",
      matchCity: "",
      matchState: "",
      keyBoardShown: false,
      matchInfoToggle: true
    };
    this.userGuid = "";
    this.user_firstName = "";

    this.roomGuid = this.props.navigation.state.params.matchRoomGuid;
    this.token = "";
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
      this.setState({
        matchFirstName: data.username
      });
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

    //handle timer
    this.socket.on("timer", data => {
      console.log("timer has started");
      //when the socket detect 2 ppl in the room
      //start the timer
      //counting is to prevent one of the user disconnect
      //the room number - 1
      //and reconnect, room number + 1 which equal 2 and re-emitting the timer event again
      //if re-emitting, time will get reset and also call the interval
      //which will cause multiple interval and speed up the timer
      if (!this.state.counting) {
        this.interval = setInterval(this.countDown, 1000);
        let currentTime = new Date();
        this.setState({
          endTime: currentTime.getTime() + this.minuteChatTimer_time * 1000
        });
        this.socket.emit("startTimer", {});
      }
      this.setState({
        counting: true
      });
    });

    //handle user typingaddChatMessage
    this.socket.on("typing", data => {
      if (this.state.matchFirstName === "") {
        this.setState({
          matchFirstName: data.username
        });
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
  }

  setMatchingUserInfo = ({
    matchUserGuid,
    matchFirstName,
    matchLastName,
    matchLikesArray,
    matchImageUrl,
    matchAge,
    matchCity,
    matchState
  }) => {
    this.setState({
      matchUserGuid: matchUserGuid,
      matchFirstName: matchFirstName,
      matchLastName: matchLastName,
      matchLikesArray: matchLikesArray,
      matchImageUrl: matchImageUrl,
      matchAge: matchAge,
      matchCity: matchCity,
      matchState: matchState
    });
  };

  setupTimer = () => {
    this.setState({
      countDownSecond: this.props.ConfigReducer.minuteChatTimer_time
    });
    return this.props.ConfigReducer.minuteChatTimer_time;
  };

  async componentDidMount() {
    //Testing USE
    //this.interval = setInterval(this.countDown, 1000);
    ///*
    this.props.navigation.navigate(
      "AcceptMatching",
      this.props.navigation.state.params
    );
    //*/
    //Testing Use
    this.minuteChatTimer_time = await this.setupTimer();

    //Setup Total Seconds

    //KeyBoard
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    //Ghost Button
    this.props.navigation.setParams({
      openMenu: () => {
        this.openMenu(true);
      }
    });

    //Setup Match User Info
    this.setMatchingUserInfo(this.props.navigation.state.params);

    //Setup Device user Info
    this.userGuid = await this.props.CreateProfileDataReducer.guid;
    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;
    this.user_imageUrl = await this.props.CreateProfileDataReducer
      .deviceUserImageUrl;

    //Setup RoomGuid
    this.roomGuid = this.props.navigation.state.params.matchRoomGuid;

    //Socket
    //emit an event to tell the socket the user has enter the room
    this.socket.emit("add user", {
      userGuid: this.userGuid,
      user_firstName: this.user_firstName
    });

    //App States
    AppState.addEventListener("change", this._handleAppStateChange);

    this.setState({
      isSuccess: true
    });
  }

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

    if (this.state.appState !== prevState.appState) {
      if (this.state.appState === "active") {
        let currentTime = new Date();
        //when app wakes up again
        //check if currentTime exceed endTime we set earlier
        if (currentTime.getTime() > this.state.endTime) {
          this.exitChat();
        } else {
          //if not then do some calculation do calculate current time
          this.setState({
            countDownSecond: Math.round(
              (this.state.endTime - currentTime.getTime()) / 1000
            )
          });
        }
      }
    }
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

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    AppState.removeEventListener("change", this._handleAppStateChange);
    clearInterval(this.interval);
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
    let str = `${this.state.currentMessage}`;
    if (this.state.currentMessage === "") {
      return;
    }
    this.addChatMessage(1, str, this.user_firstName);
    this.socket.emit("new message", {
      userGuid: this.userGuid,
      message: this.state.currentMessage
    });
    this.setState({
      currentMessage: ""
    });
    this.scrollView.scrollToEnd({ animated: true });
  };

  countDown = () => {
    this.setState({
      countDownSecond: --this.state.countDownSecond
    });
    if (this.state.countDownSecond <= 0) {
      this.goToAcceptMatchingScreen();
    }
  };

  goToAcceptMatchingScreen = () => {
    clearInterval(this.interval);
    //THIS WORK ONLY FROM CHATLIST TO CHATROOM
    //this.props.navigation.getParam.forceReRender;
    this.socket.emit("disconnect");
    //For MinuteChatRoom, direct user go back to home
    this.props.navigation.navigate("AcceptMatching", this.props.navigation.state.params);
  };

  exitChat = () => {
    clearInterval(this.interval);
    //THIS WORK ONLY FROM CHATLIST TO CHATROOM
    //this.props.navigation.getParam.forceReRender;
    this.socket.emit("disconnect");
    //For MinuteChatRoom, direct user go back to home
    this.props.navigation.navigate("Home");
  };

  openMenu = visible => {
    this.setState({ modalVisible: visible });
  };

  messageType = (messageItem, index) => {
    //1 - device user message
    //2 - matching user message
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
          <View key={index}>
            <View style={styles.textContainer}>
              <Image
                blurRadius={10}
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
          </View>
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

  successScreen = () => {
    let displayAllChatMessage = this.state.allMessages.map(
      (messageItem, index = 0) => {
        return this.messageType(messageItem, index);
      }
    );

    let displayMatchLikesArray = this.state.matchLikesArray.map(
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

    let matchInfoToggle = (
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

    let matchInfo = this.state.matchInfoToggle && (
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
            {displayMatchLikesArray}
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
            <View style={{ alignItems: "center" }}>
              <Image
                blurRadius={10}
                source={{
                  uri: this.state.matchImageUrl
                }}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  borderRadius: width * 0.098,
                  margin: "3%"
                }}
              />
            </View>

            {/*Matched Info*/}
            {matchInfoToggle}

            {matchInfo}

            <View style={{ top: "3%" }}>
              <View
                style={{
                  borderWidth: 3,
                  width: width * 2,
                  borderColor: "#ffe6e6",
                  top: 3
                }}
              />
              <View
                style={{
                  borderWidth: 3,
                  width:
                    this.state.countDownSecond *
                    (width / this.minuteChatTimer_time),
                  borderColor: "purple",
                  top: -3,
                  borderTopRightRadius: 3,
                  borderBottomRightRadius: 3
                }}
              />
            </View>
          </View>
          {/*Messages*/}
          <ScrollView
            style={{ backgroundColor: "#d6f5f5" }}
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            contentInset={{ top: 0, left: 0, bottom: 50, right: 0 }}
            keyboardDismissMode={"on-drag"}
            //contentContainerStyle={styles.contentContainer}
            //paddingVertical= {-20}
          >
            <View style={{ margin: "3%" }}>{displayAllChatMessage}</View>

            {this.state.isTyping && (
              <View style={styles.textContainer}>
                <Text style={styles.matchMessageIcon}>
                  {this.state.matchFirstName}
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

          {/*Exit Chat POP UP*/}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
          >
            <View
              style={{
                position: "absolute",
                height: width * 0.4,
                width: width * 0.53,
                top: "40%",
                alignSelf: "center",
                backgroundColor: "#3399ff",
                borderRadius: 30
              }}
            >
              <View>
                <View style={{ padding: "10%" }} />
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: width * 0.032 }}>
                    Do you want to exit the chat?
                  </Text>

                  <View style={{ padding: "5%" }} />

                  <View
                    style={{
                      flexDirection: "row"
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#fff",
                        padding: "3%",
                        borderRadius: 50
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.exitChat();
                          this.openMenu(!this.state.modalVisible);
                        }}
                      >
                        <Text style={{ color: "#3399ff" }}>Yes</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ padding: "5%" }} />

                    <View
                      style={{
                        backgroundColor: "#fff",
                        padding: "3%",
                        borderRadius: 50
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.openMenu(!this.state.modalVisible);
                        }}
                      >
                        <Text style={{ color: "#3399ff" }}>No</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
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
    minWidth: width * 0.13,
    maxWidth: width * 0.8,
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
    minWidth: width * 0.13,
    maxWidth: width * 0.8,
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
)(MinuteChatRoomScreen);
