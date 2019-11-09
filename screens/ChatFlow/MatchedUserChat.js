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
  TextInput
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
      isTyping: false
    };
    this.guid = "";
    this.user_firstName = "";
    this.matched_user_firstName = "";

    this.socket = io("http://74.80.250.210:3060");

    //handle new message
    this.socket.on("new message", data => {
      let str = `${data.username} : ${data.message}`;
      this.addChatMessage(false, str);
    });

    //handle user joined
    this.socket.on("user joined", data => {
      let str = `${data.username} has joined`;
      this.addChatMessage(false, str);
    });

    //handle user left
    this.socket.on("user left", data => {
      let str = `${data.username} has left`;
      this.addChatMessage(false, str);
    });

    //handle user typing
    this.socket.on("typing", data => {
      this.setState({
        isTyping: true
      });
    });

    //handle user not typing
    this.socket.on("stop typing", data => {
      this.setState({
        isTyping: false
      });
    });
  }

  async componentDidMount() {
    this.guid = await this.props.CreateProfileDataReducer.guid;
    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;
    //emit an event to tell the socket the user has enter the room
    this.socket.emit("add user", this.user_firstName);

    //this will be assign from the ChatUsersList.js
    this.matched_user_firstName = "he/she";

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

  //add a new message into the allMessageArray
  addChatMessage = (isDeviceUser, message) => {
    let allMessages = this.state.allMessages;
    allMessages.push({ isDeviceUser: isDeviceUser, message: message });
    this.setState({
      allMessages: allMessages
    });
  };

  //user send a message
  submitMessage = () => {
    let str = `${this.state.currentMessage} : ${this.user_firstName}`;
    this.addChatMessage(true, str);
    this.socket.emit("new message", this.state.currentMessage);
    this.setState({
      currentMessage: ""
    });
  };

  successScreen = () => {
    let displayAllChatMessage = this.state.allMessages.map(
      (messageItem, index = 0) => {
        return messageItem.isDeviceUser ? (
          <View key={index} style={styles.deviceUserMessageText}>
            <Text>{messageItem.message}</Text>
          </View>
        ) : (
          <View key={index}>
            <Text>{messageItem.message}</Text>
          </View>
        );
      }
    );

    return (
      <View style={styles.container}>
        <ScrollView>
          {displayAllChatMessage}
          <Text>
            {this.state.isTyping && `${this.matched_user_firstName} is typing`}
          </Text>
        </ScrollView>

        <View style={styles.messageInputBox}>
          <TextInput
            placeholder="Type in a Message!"
            onChangeText={currentMessage => this.setState({ currentMessage })}
            value={this.state.currentMessage}
          />
          <Button title="Right button" onPress={this.submitMessage} />
          <View style={{ padding: "3%" }} />
        </View>
      </View>
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
  },
  deviceUserMessageText: {
    alignItems: "flex-end"
  },
  messageInputBox: {
    flexDirection: "column",
    justifyContent: "flex-end"
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
