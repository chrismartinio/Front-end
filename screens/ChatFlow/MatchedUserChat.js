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

import io from "socket.io-client";

class MatchedUserChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allMessages: [],
      currentMessage: ""
    };
    this.socket = io("http://74.80.250.210:3060");
    // Whenever the server emits 'new message', update the chat body
    this.socket.on("new message", data => {
      this.addChatMessage(data.message);
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

  handleMessage = () => {
    this.setState({
      currentMessage: ""
    });
    this.addChatMessage(this.state.currentMessage);
    this.socket.emit("new message", this.state.currentMessage);
  };

  componentDidMount() {
    this.socket.emit("add user", this.state.device_userName);
  }

  render() {
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
        <Button title="Right button" onPress={this.handleMessage} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default MatchedUserChat;
