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
  TouchableHighlight
} from "react-native";

import { connect } from "react-redux";

import io from "socket.io-client";

import LoadingScreen from "./components/LoadingScreen";
import MatchedUserChat from "./MatchedUserChat";

class ChatUsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchedChatList: [
        { matched_user_name: "Apple", chatroomID: "12345" },
        { matched_user_name: "Bay", chatroomID: "56789" }
      ],
      isLoading: false
    };
    this.guid = "";
    this.user_firstName = "";
    this.socket = io("http://74.80.250.210:3060");
    this.scrollY;
  }

  async componentDidMount() {
    /*
    this.guid = await this.props.CreateProfileDataReducer.guid;

    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;
      */
    this.guid = "";
    this.user_firstName = "You";

    console.log(this.guid);
    console.log(this.user_firstName);
    this.setState({
      isLoading: true
    });
  }

  enterChatRoom = chatRoomData => {
    console.log(chatRoomData);
    this.props.navigation.navigate("MatchedUserChat");
  };

  handleScroll = ({ nativeEvent }) => {
    const { contentOffset } = nativeEvent;
    this.scrollY = contentOffset.y;
  };

  successScreen = () => {
    let displayAllChatList = this.state.matchedChatList.map(
      (chatRoomData, index = 0) => {
        return (
          <View key={index}>
            <TouchableHighlight
              underlayColor="#f3f3f3"
              style={styles.chatRoomBox}
              onPress={() => {
                this.enterChatRoom(chatRoomData);
              }}
            >
              <Text>{chatRoomData.matched_user_name}</Text>
            </TouchableHighlight>
          </View>
        );
      }
    );

    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text>Chat Rooms</Text>
        </View>
        <ImageBackground
          source={require("../../assets/Assets_V1/Butterfly_Background/butterflyBackground.png")}
          style={styles.backgroundImage}
        >
          <ScrollView
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
          >
            {displayAllChatList}
          </ScrollView>
        </ImageBackground>
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
    flex: 1
  },
  chatRoomBox: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "white",
    alignItems: "center"
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1
  },
  titleBox: {
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    alignItems: "center",
    backgroundColor: "lightblue"
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
)(ChatUsersList);
