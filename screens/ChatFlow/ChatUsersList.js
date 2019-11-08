import React from "react";

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from "react-native";

import io from "socket.io-client";

class ChatUsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: [],
      device_userName: "ABC" //user login, OAuth should get GUID and store into JWT
      //but since OAuth is not funtional now, we use email for testing now
      //when user login, store email into redux or pass as para when navigate
    };
    this.socket = io("http://74.80.250.210:3060");
    this.socket.on("user joined", data => {
      let usersList = this.state.usersList;
      usersList.push(data.username);
      this.setState({
        usersList: usersList
      });
    });
  }

  componentDidMount() {
    this.socket.emit("add user", this.state.device_userName);
  }

  render() {
    let displayUsersList = this.state.usersList.map((userName, index = 0) => {
      return (
        <View key={index}>
          <Text>{userName}</Text>
        </View>
      );
    });
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>usersList</Text>
          {displayUsersList}
        </View>
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

export default ChatUsersList;
