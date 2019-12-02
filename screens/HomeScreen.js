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

import LoadingScreen from "./ChatFlow/components/LoadingScreen";
import MatchedUserChat from "./ChatFlow/MatchedUserChat";

import { localhost } from "../config/ipconfig";

class HomeScreen extends React.Component {
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
    //this.socket = io("http://74.80.250.210:3060");
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
    /*
    fetch("http://10.0.0.246:3003/api/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: { guid: this.guid, user_firstName: this.user_firstName }
      })
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        //here's what I will get the chatobject
        console.log(res.roomID[0].key); //1231231231.1231231232131
      });
*/
    //console.log(this.guid);
    //console.log(this.user_firstName);
    this.setState({
      isLoading: true
    });
  }

  componentWillUnmount() {
    //this.socket.off();
  }

  enterChatRoom = chatRoomData => {
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
        <ImageBackground
          source={require("../assets/Assets_V1/Butterfly_Background/butterflyBackground.png")}
          style={styles.backgroundImage}
        >
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>Chat Rooms</Text>
          </View>
          <ScrollView
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
          >
            <View style={styles.chatRoomBoxWrap}>{displayAllChatList}</View>
          </ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end"
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <View
                style={{
                  width: 100,
                  height: 75,
                  backgroundColor: "powderblue"
                }}
              >
                <Button
                  title="Go to Profile"
                  onPress={() =>
                    this.props.navigation.navigate("Profile", {
                      guid: this.props.CreateProfileDataReducer.guid,
                      isDeviceUser: true
                    })
                  }
                />
              </View>
              <View
                style={{ width: 100, height: 75, backgroundColor: "skyblue" }}
              >
                <Button
                  title="Go to Match"
                  onPress={() => this.props.navigation.navigate("Match")}
                />
              </View>
              <View
                style={{
                  width: 100,
                  height: 75,
                  backgroundColor: "powderblue"
                }}
              >
                <Button
                  title="Go to Setting"
                  onPress={() => this.props.navigation.navigate("Setting")}
                />
              </View>
            </View>
          </View>
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
    width: "100%",
    flex: 1
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
)(HomeScreen);
