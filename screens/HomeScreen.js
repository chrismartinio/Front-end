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
  TouchableHighlight,
  AppState
} from "react-native";

import { connect } from "react-redux";

import io from "socket.io-client";

import LoadingScreen from "../sharedComponents/LoadingScreen";

import { localhost } from "../config/ipconfig";

import Footer from "../sharedComponents/Footer";

//1. make an error screen for no data for profile screen and edit screen
//2. delay footer buttons
//3. fix faill storing

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      matchedChatList: [
        { matched_user_name: "Apple", chatroomID: "12345" },
        { matched_user_name: "Bay", chatroomID: "56789" },
        { matched_user_name: "Apple", chatroomID: "12345" },
        { matched_user_name: "Bay", chatroomID: "56789" },
        { matched_user_name: "Apple", chatroomID: "12345" },
        { matched_user_name: "Bay", chatroomID: "56789" },
        { matched_user_name: "Apple", chatroomID: "12345" },
        { matched_user_name: "Bay", chatroomID: "56789" },
        { matched_user_name: "Apple", chatroomID: "12345" },
        { matched_user_name: "Bay", chatroomID: "56789" }
      ],
      isSuccess: false
    };

    //this.socket = io("http://74.80.250.210:3060");
    this.scrollY;
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.guid = await this.props.CreateProfileDataReducer.guid;

    this.user_firstName = await this.props.CreateProfileDataReducer.aboutYouData
      .firstName;

    console.log("HomeScreen");
    console.log("USER GUID: ", this.guid);
    console.log("USER firstName: ", this.user_firstName);

    /*
    await fetch(`http://${localhost}:3003/api/chat/`, {
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
    this.setState({
      isSuccess: true
    });
  }

  componentWillUnmount() {
    //this.socket.off();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
   if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
     //Here should go some logic to to update the dB prob createAccount with appStatus: "foreground"
     console.log('User: ' + this.guid + ' has come to the foreground!');
   } else {
     //Here should go some logic to to update the dB prob createAccount with appStatus: "background"
     console.log('User: ' + this.guid + ' has gone to the background!')
   }
   this.setState({ appState: nextAppState });
 };

  enterChatRoom = chatRoomData => {
    this.props.navigation.navigate("MinuteChatRoom");
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
          <View style={{ flex: 0.9 }}>
            {/*Room list */}
            <ScrollView
              ref={scrollView => {
                this.scrollView = scrollView;
              }}
              onScroll={this.handleScroll}
              scrollEventThrottle={16}
            >
              <View style={styles.chatRoomBoxWrap}>{displayAllChatList}</View>
            </ScrollView>
          </View>
          {/*Footer*/}
          <Footer navigation={this.props.navigation} />
        </ImageBackground>
      </View>
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
    width: "100%"
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
