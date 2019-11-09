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
      isLoading: false
    };
    this.guid = "";
    this.firstName = "";

    this.socket = io("http://74.80.250.210:3060");

    //handle new message
    this.socket.on("new message", data => {
      let str = `${data.username} : ${data.message}`;
      this.addChatMessage(str);
    });

    //handle user joined
    this.socket.on("user joined", data => {
      let str = `${data.username} has joined`;
      this.addChatMessage(str);
    });

    //handle user left
    this.socket.on("user left", data => {
      let str = `${data.username} has left`;
      this.addChatMessage(str);
    });

    //handle user typing
    this.socket.on("typing", data => {
      let str = `${data.username} is typing`;
      this.addChatMessage(str);
    });

    //handle user not typing
    this.socket.on("stop typing", data => {
      let str = `${data.username} is typing`;
      this.removeChatMessage(str);
    });
  }

  //add a new message into the allMessageArray
  addChatMessage = message => {
    let allMessages = this.state.allMessages;
    allMessages.push(message);
    this.setState({
      allMessages: allMessages
    });
  };

  //remove the typing message from the allMessageArray
  removeChatMessage = message => {
    let lastIndex = allMessages.lastIndexOf(message);
    let allMessages = this.state.allMessages.splice(lastIndex, 1);
  };

  //user send a message
  submitMessage = () => {
    let str = `${this.firstName} : ${this.state.currentMessage}`;
    this.addChatMessage(str);
    this.socket.emit("new message", this.state.currentMessage);
    this.setState({
      currentMessage: ""
    });
  };

  async componentDidMount() {
    this.guid = await this.props.CreateProfileDataReducer.guid;
    this.firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;
    this.socket.emit("add user", this.firstName);
    this.setState({
      isLoading: true
    });
  }

  successScreen = () => {
    let displayAllChatMessage = this.state.allMessages.map(
      (message, index = 0) => {
        return (
          <View key={index}>
            <Text>{message}</Text>
          </View>
        );
      }
    );
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>usersList</Text>
          {displayAllChatMessage}
        </View>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type in a Message!"
          onChangeText={currentMessage => this.setState({ currentMessage })}
          value={this.state.currentMessage}
        />
        <Button title="Right button" onPress={this.submitMessage} />
      </ScrollView>
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
