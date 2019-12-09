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

import CircularCarousel from "./ChatFlow/Chat_SharedComponents/CircularCarousel";

//1. make an error screen for no data for profile screen and edit screen
//2. delay footer buttons
//3. fix faill storing

const testobj = [
  {
    matchedFirstName: "Aaa 1",
    matchedGuid: "5de42a14b4dc5b1fba94e1d3",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg"
  },
  {
    matchedFirstName: "Kachi 2",
    matchedGuid: "5de42b16b4dc5b1fba94e1d4",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://www.guideposts.org/sites/guideposts.org/files/styles/hero_box_left_lg/public/story/dick_van_dyke_marquee.jpg"
  },
  {
    matchedFirstName: "Demetus 3",
    matchedGuid: "5de4b4ec6f3077a0d5252ddd",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "http://shared.frenys.com/assets/1009731/6151100-Young-Harrison-Ford.jpg"
  },
  {
    matchedFirstName: "Mike 4",
    matchedGuid: "5de4b6a26f3077a0d5252dde",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage: "https://www.famousbirthdays.com/faces/efron-zac-image.jpg"
  },
  {
    matchedFirstName: "Qiuwen 5",
    matchedGuid: "5de6e7a326e5604c8552d774",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  },
  {
    matchedFirstName: "Kevin 6",
    matchedGuid: "5de7a9a888fab05ca501ae9a",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg"
  },
  {
    matchedFirstName: "BBB 7",
    matchedGuid: "5de42a14b4dc5b1fba94e1d3",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg"
  },
  {
    matchedFirstName: "wewewe 8",
    matchedGuid: "5de42b16b4dc5b1fba94e1d4",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://www.guideposts.org/sites/guideposts.org/files/styles/hero_box_left_lg/public/story/dick_van_dyke_marquee.jpg"
  },
  {
    matchedFirstName: "awww 9",
    matchedGuid: "5de4b4ec6f3077a0d5252ddd",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "http://shared.frenys.com/assets/1009731/6151100-Young-Harrison-Ford.jpg"
  },
  {
    matchedFirstName: "asdasd 10",
    matchedGuid: "5de4b6a26f3077a0d5252dde",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage: "https://www.famousbirthdays.com/faces/efron-zac-image.jpg"
  },
  {
    matchedFirstName: "zxczxc 11",
    matchedGuid: "5de6e7a326e5604c8552d774",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  },
  {
    matchedFirstName: "gerge 12",
    matchedGuid: "5de7a9a888fab05ca501ae9a",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg"
  },
  {
    matchedFirstName: "nccb 13",
    matchedGuid: "5de42a14b4dc5b1fba94e1d3",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  },
  {
    matchedFirstName: "cbdbfdd 14",
    matchedGuid: "5de42b16b4dc5b1fba94e1d4",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  },
  {
    matchedFirstName: "mjgmhgm 15",
    matchedGuid: "5de4b4ec6f3077a0d5252ddd",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  },
  {
    matchedFirstName: "jkjk,j 16",
    matchedGuid: "5de4b6a26f3077a0d5252dde",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  },
  {
    matchedFirstName: "ghjghj 17",
    matchedGuid: "5de6e7a326e5604c8552d774",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  },
  {
    matchedFirstName: "ytjty 18",
    matchedGuid: "5de7a9a888fab05ca501ae9a",
    matchedMinuteRoomID: "someRoomNumber",
    matchedLocation: "Oakland",
    matchedAge: "27",
    matchedLastMessage: "I like that restaurant too, let's...",
    matchedLastRepliedDate: "Some Date",
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  }
];

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      matchedUsersList: testobj,
      isSuccess: false
    };

    //this.socket = io("http://74.80.250.210:3060");
    this.scrollY;
  }

  async componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
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
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("User: " + this.guid + " has come to the foreground!");
      await fetch(`http://${localhost}:3020/api/pushNotification/appState`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: { guid: this.guid, appState: "foreground" }
        })
      })
        .then(() => console.log("success"))
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log("User: " + this.guid + " has gone to the background!");
      await fetch(`http://${localhost}:3020/api/pushNotification/appState`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: { guid: this.guid, appState: "background" }
        })
      })
        .then(() => console.log("success"))
        .catch(error => {
          console.log(error);
        });
    }
    this.setState({ appState: nextAppState });
  };

  successScreen = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          {/*CircularCarousel */}
          <CircularCarousel
            navigation={this.props.navigation}
            matchedUsersList={this.state.matchedUsersList}
          />
        </View>

        {/*Footer*/}
        <Footer navigation={this.props.navigation} />
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
    flex: 1,
    backgroundColor: "#4d88ff"
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
  },
  buttonStyle: {
    borderRadius: 20,
    color: "white",
    backgroundColor: "#18cdf6",
    width: 200,
    alignSelf: "center",
    marginBottom: 20,
    fontStyle: "italic"
  },
  buttonStyleOutline: {
    borderRadius: 20,
    color: "#18cdf6",
    borderWidth: 1,
    borderColor: "#18cdf6",
    width: 200,
    alignSelf: "center",
    marginBottom: 5,
    fontStyle: "italic"
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
