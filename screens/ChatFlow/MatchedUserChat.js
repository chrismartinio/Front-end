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
      name: "",
      guid: ""
    };
    this.guid = "";
    this.firstName = "";

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

  async componentDidMount() {
    this.guid = await this.props.CreateProfileDataReducer.guid;
    this.firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;

    console.log(this.guid);
    console.log(this.firstName);

    this.setState({
      isLoading: true
    });
    this.socket.emit("add user", this.state.device_userName);
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
        <Button title="Right button" onPress={this.handleMessage} />
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
