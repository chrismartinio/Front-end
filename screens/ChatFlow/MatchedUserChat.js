import React from "react";

import {
  Image,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  ImageBackground
} from "react-native";
import { connect } from "react-redux";

import io from "socket.io-client";

import LoadingScreen from "./components/LoadingScreen";

class MatchedUserChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      currentMessage: "",
      isLoading: false,
      isTyping: false,
      timerSecond: 90
    };
    this.guid = "";
    this.user_firstName = "";
    this.matched_user_firstName = "";
    this.socket = io("http://74.80.250.210:3060");

    //handle new message
    this.socket.on("new message", data => {
      let str = `${data.username} : ${data.message}`;
      this.addChatMessage(2, str);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle user joined
    this.socket.on("user joined", data => {
      this.matched_user_firstName = data.username;
      let str = `${data.username} has joined`;
      this.addChatMessage(3, str);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle user left
    this.socket.on("user left", data => {
      let str = `${data.username} has left`;
      this.addChatMessage(3, str);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle timer
    this.socket.on("timer", data => {
      this.interval = setInterval(this.countDown, 1000);
    });

    //handle user typing
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
      this.addChatMessage(3, str);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });

    //handle reconnect
    this.socket.on("reconnect", () => {
      this.socket.emit("add user", this.user_firstName);
      let str = "you have been reconnected to the server";
      this.addChatMessage(3, str);
      if (this.scrollView != null) {
        this.scrollView.scrollToEnd({ animated: true });
      }
    });
  }

  async componentDidMount() {
    this.guid = await this.props.CreateProfileDataReducer.guid;

    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;

    //this.guid = "";
    //this.user_firstName = "You";

    //emit an event to tell the socket the user has enter the room
    this.socket.emit("add user", this.user_firstName);

    this.setState({
      isLoading: true
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
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.socket.close();
  }

  //add a new message into the allMessageArray
  addChatMessage = (type, message) => {
    let allMessages = this.state.allMessages;
    allMessages.push({
      type: type,
      message: message,
      userName: this.user_firstName,
      timeStamp: new Date()
    });
    this.setState({
      allMessages: allMessages
    });
  };

  //user send a message
  submitMessage = () => {
    let str = `${this.state.currentMessage}`;
    this.addChatMessage(1, str);
    this.socket.emit("new message", this.state.currentMessage);
    this.setState({
      currentMessage: ""
    });
    this.scrollView.scrollToEnd({ animated: true });
  };

  countDown = () => {
    this.setState({
      timerSecond: --this.state.timerSecond
    });
    if (this.state.timerSecond <= 0) {
      clearInterval(this.interval);
      this.backToChatUsersList();
    }
  };

  backToChatUsersList = () => {
    this.socket.emit("disconnect");
    this.props.navigation.navigate("ChatUsersList");
  };

  messageType = (messageItem, index) => {
    //1 - device user
    //2 - matched user
    //3 - regular message
    switch (messageItem.type) {
      case 1:
        return (
          <View key={index} style={styles.deviceUserMessageView}>
            <View style={styles.textContainer}>
              <Text style={styles.deviceUserMessageText}>
                {`${messageItem.message}\n`}
                <Text style={styles.dateTime}>{`${
                  messageItem.timeStamp
                }`}</Text>
              </Text>
              <Text style={styles.circle}> {messageItem.userName[0]}</Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View key={index}>
            <View style={styles.textContainer}>
              <Text style={styles.circlePurple}>
                {" "}
                {messageItem.userName[0]}
              </Text>
              <Text style={styles.targetMessageText}>
                {`${messageItem.message}\n`}
                <Text style={styles.dateTimeLeft}>{`${
                  messageItem.timeStamp
                }`}</Text>
              </Text>
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

  successScreen = () => {
    let displayAllChatMessage = this.state.allMessages.map(
      (messageItem, index = 0) => {
        return this.messageType(messageItem, index);
      }
    );

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <ImageBackground
            source={require("../../assets/Assets_V1/Butterfly_Background/butterflyBackground.png")}
            style={styles.backgroundImage}
          >
            <Button title="Back" onPress={this.backToChatUsersList} />
            <Text>{this.state.timerSecond} seconds left</Text>
            <Image
              style={{
                width: 90 * 2,
                height: 10
              }}
              source={require("../../assets/Assets_V1/greybar.jpg")}
            />
            <Image
              style={{
                top: -10,
                width: this.state.timerSecond * 2,
                height: 10
              }}
              source={require("../../assets/Assets_V1/bluebar.jpg")}
            />
            <ScrollView
              ref={scrollView => {
                this.scrollView = scrollView;
              }}
              contentInset={{ top: 0, left: 0, bottom: 50, right: 0 }}
              keyboardDismissMode={"on-drag"}
              //contentContainerStyle={styles.contentContainer}
              //paddingVertical= {-20}
            >
              {displayAllChatMessage}

              {this.state.isTyping && (
                <View style={styles.textContainer}>
                  <Text style={styles.circlePurple}>
                    {" "}
                    {this.matched_user_firstName[0]}
                  </Text>
                  <Text style={styles.targetMessageText}>is typing...</Text>
                </View>
              )}
            </ScrollView>
            {/* <KeyboardAvoidingView style={styles.container} behavior="padding" enabled> */}
            <View style={styles.messageInputBox}>
              <TextInput
                style={styles.messageInputStyle}
                placeholder="Type in a Message!"
                onChangeText={currentMessage =>
                  this.setState({ currentMessage })
                }
                value={this.state.currentMessage}
              />
              <View style={styles.buttonStyle}>
                <Button title="Submit Message" onPress={this.submitMessage} />
              </View>
              <View style={{ padding: "3%" }} />
            </View>

            {/* </KeyboardAvoidingView> */}
          </ImageBackground>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };

  loadingScreen = () => {
    return <LoadingScreen />;
  };

  render() {
    return this.state.isLoading ? this.successScreen() : this.loadingScreen();
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
    overflow: "hidden",
    //  borderRadius: 10,
    //  borderWidth: 12,
    //  borderColor: "#3399ff",
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
    borderRadius: 10,
    width: 300,
    borderColor: "#3399ff",
    backgroundColor: "#3399ff",
    color: "#fff",
    padding: 5
  },
  targetMessageText: {
    overflow: "hidden",
    borderRadius: 10,
    width: 300,
    borderColor: "#cccccc",
    backgroundColor: "#cccccc",
    color: "#000",
    padding: 5
  },
  deviceUserName: {
    overflow: "hidden",
    padding: 15,
    borderRadius: 40,
    backgroundColor: "#00ff00",
    color: "#000"
  },
  messageInputStyle: {
    backgroundColor: "#cccccc",
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
    margin: 5
  },
  circle: {
    marginLeft: 5,
    overflow: "hidden",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "red",
    textAlign: "center",
    paddingTop: 7
  },
  circlePurple: {
    marginRight: 5,
    overflow: "hidden",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "purple",
    textAlign: "center",
    paddingTop: 7,
    color: "white"
  },
  deviceUserMessageView: {
    alignItems: "flex-end"
  },
  buttonStyle: {
    borderRadius: 10,
    color: "white",
    backgroundColor: "blue",
    width: 200,
    alignSelf: "center",
    marginBottom: 20,
    fontStyle: "italic"
  },
  messageInputBox: {
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  typingIndicator: {
    fontStyle: "italic"
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1
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
)(MatchedUserChat);
