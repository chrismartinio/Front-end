import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  Alert
} from "react-native";
import {
  server_profile,
  server_frontendConfig,
  server_chat
} from "../../config/ipconfig";
import axios from "axios";
import { connect } from "react-redux";
import LoadingScreen from "../../sharedComponents/LoadingScreen";
import Footer from "../../sharedComponents/Footer";
import { Card } from "react-native-paper";
import { testobj } from "../../data/testObj";
const { height, width } = Dimensions.get("window");
import SetTimeAction from "../../storage/actions/ConfigReducerActions/SetTimeAction/";
import SetNewMatchlistAction from "../../storage/actions/MatchReducerActions/SetNewMatchlistAction";

import io from "socket.io-client";
import Constants from "expo-constants";

import {
  insertDataIntoLocalStorage,
  selectDataFromLocalStorage,
  selectIdByGuidFromLocalStorage
} from "../ProfileFlow/LocalStorage/localStorage.js";

//Because this is navigation stack, previous screen won't call componentWillUnmount, so won't close socket
//this.socket.close();
//Device user presses Back -> setDeviceUserReject -> Home
//Match user presses Back -> this.socket.on("ghostChat") -> componentDidUpdate -> backToHome -> Home
//Device & Match press Accept -> this.socket.on("acceptChat") -> componentDidUpdate -> bothAccept -> Minute

async function updateMatchlist(deviceUserGuid, matchUserGuid) {
  let interestsObject = await selectDataFromLocalStorage(
    "device_user_matchlist",
    1
  );

  //Query the matchlist
  let { guid, matchlist } = interestsObject.result.rows._array[0];
  if (guid !== deviceUserGuid) {
    return false;
  }
  matchlist = JSON.parse(matchlist);
  matchlist = matchlist.filter(match => match.matchedUser !== matchUserGuid);

  //store to matchlist
  //LocalStorage
  let json_matchlist = JSON.stringify(matchlist);
  //Only insert or replace id = 1
  let insertSqlStatement =
    "INSERT OR REPLACE into device_user_matchlist(id, createAccount_id, matchlist, guid) " +
    "values(1, 1, ?, ?);";

  let { success } = await insertDataIntoLocalStorage(
    insertSqlStatement,
    "device_user_matchlist",
    [json_matchlist, deviceUserGuid],
    true
  );
  return true;
}

class FoundaMatch extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <Button
          color="#fff"
          title="Back"
          onPress={navigation.getParam("backToHome")}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      isDeviceUserAccept: false,
      isDeviceUserClicked: false,
      isMatchUserAccept: false,
      isMatchUserClicked: false,
      matchUserGuid: "",
      matchRoomGuid: "",
      matchFirstName: "",
      matchLastName: "",
      matchLikesArray: "",
      matchImageUrl: "",
      matchMiles: "4.26",
      matchAge: "",
      matchCity: "",
      matchState: ""
    };
    this.roomGuid = this.props.navigation.state.params.matchRoomGuid;
    this.token = "";
    this.socket = io(`${server_chat}/${this.roomGuid}`, {
      forceNew: true,
      transportOptions: {
        polling: {
          extraHeaders: {
            authorization: "Bearer " + this.token // if you have token for auth
          }
        }
      },
      query: {
        namespace: this.roomGuid
      }
    });

    //handle ghost
    this.socket.on("ghostChat", () => {
      console.log("AcceptMatching");
      if (Constants.isDevice) {
        console.log("===phone===");
      } else {
        console.log("===simulator===");
      }

      this.socket.emit("disconnect", {});

      updateMatchlist(
        this.props.CreateProfileDataReducer.guid,
        this.state.matchUserGuid
      );
      //this.props.SetNewMatchlistAction({ matchlist: matchlist });

      this.setState({ isMatchUserClicked: true, isMatchUserAccept: false });
    });

    //handle accept
    this.socket.on("acceptChat", () => {
      console.log("AcceptMatching");
      if (Constants.isDevice) {
        console.log("===phone===");
      } else {
        console.log("===simulator===");
      }
      this.setState({ isMatchUserClicked: true, isMatchUserAccept: true });
    });
  }

  setMatchingUserInfo = ({
    firstName,
    lastName,
    likesArray,
    imageUrl,
    city,
    age,
    state
  }) => {
    this.setState({
      matchUserGuid: this.props.navigation.state.params.matchUserGuid,
      matchRoomGuid: this.props.navigation.state.params.matchRoomGuid,
      matchFirstName: firstName,
      matchLastName: lastName,
      matchLikesArray: likesArray,
      matchImageUrl: imageUrl,
      matchMiles: "4.26",
      matchAge: age,
      matchCity: city,
      matchState: state,
      isSuccess: true
    });
  };

  calculateAge = birthday => {
    birthday = new Date(birthday);
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  setTimer = async () => {
    fetch(`${server_frontendConfig}/api/frontendconfig/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        this.props.SetTimeAction({
          time: res.result.minuteChatTimer
        });
        this.setState({
          timerPass: true
        });
      })
      .catch(err => {
        this.setState({
          timerPass: true
        });
      });
  };

  async componentDidMount() {
    this.roomGuid = this.props.navigation.state.params.matchRoomGuid;

    //exit button
    this.props.navigation.setParams({
      backToHome: () => {
        this.setDeviceUserReject();
      }
    });

    //fetch data
    axios
      .post(
        `${server_profile}/api/profile/chat_query`,
        {
          matchUserGuidArray: [
            this.props.navigation.state.params.matchUserGuid
          ],
          collection: "aboutYou"
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(response => {
        this.setMatchingUserInfo(response.data.result[0]);
      })
      .catch(error => {
        console.log("Error: ", error);
        return this.props.navigation.navigate("Home");
      });
    await this.setTimer();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.isDeviceUserAccept !== this.state.isDeviceUserAccept ||
      prevState.isMatchUserAccept !== this.state.isMatchUserAccept ||
      prevState.isMatchUserClicked !== this.state.isMatchUserClicked
    ) {
      //Testing use
      //this.bothAccept();
      //Testing use

      //isMatchUserAccept is set to default
      //if Device's user triggers componentDidUpdate, (either accept or reject)
      //and because isMatchUserAccept is false by default
      //this would lead to a situation that match user didn't do any response
      //but device's user does and send device's back to home
      if (
        this.state.isMatchUserAccept === false &&
        this.state.isMatchUserClicked
      ) {
        console.log("Match Reject");
        return this.backToHome();
      }

      //if both users click accept
      if (this.state.isDeviceUserAccept && this.state.isMatchUserAccept) {
        console.log("Both Accept");
        return this.bothAccept();
      }
    }
  }

  setDeviceUserReject = () => {
    console.log("Device Reject");

    Alert.alert(
      "Warning!",
      "Are you sure you want to leave?",
      [
        {
          text: "Yes",
          onPress: () => {
            //setState
            this.setState({
              isDeviceUserAccept: false,
              isDeviceUserClicked: true
            });
            this.socket.emit("vote", {
              voteData: "ghost",
              userGuid: this.props.CreateProfileDataReducer.guid,
              matchedUserGuid: this.state.matchUserGuid
            });

            updateMatchlist(
              this.props.CreateProfileDataReducer.guid,
              this.state.matchUserGuid
            );

            this.socket.close();
            this.props.navigation.navigate("Home");
          }
        },
        {
          text: "No",
          onPress: () => {},
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };

  backToHome = () => {
    console.log("Back to HomeScreen.js");
    Alert.alert(
      "Ops!",
      `${
        this.state.matchFirstName
      } Rejected you! You will be return to Home Screen.`,
      [
        {
          text: "OK",
          onPress: () => {
            this.socket.close();
            this.props.navigation.navigate("Home");
          }
        }
      ],
      { cancelable: false }
    );
  };

  bothAccept = () => {
    console.log("Both Accept, Directing to MinuteChatRoom");
    this.socket.close();
    this.props.navigation.navigate("MinuteChatRoom", this.state);
  };

  setDeviceUserAccept = () => {
    console.log("Accept");
    //emit socket for accept
    this.socket.emit("vote", {
      voteData: "matched",
      userGuid: this.props.CreateProfileDataReducer.guid,
      matchedUserGuid: this.state.matchUserGuid
    });

    this.socket.emit("disconnect", {});

    updateMatchlist(
      this.props.CreateProfileDataReducer.guid,
      this.state.matchUserGuid
    );

    //setState
    this.setState({
      isDeviceUserAccept: true,
      isDeviceUserClicked: true
    });
  };

  successScreen = () => {
    let displayMatchedLikesArray = this.state.matchLikesArray.map(
      (e, index) => {
        return (
          <View key={index++}>
            <TouchableOpacity style={styles.likeButtonWrap}>
              <Text style={styles.likeButton}>#{e}</Text>
            </TouchableOpacity>
          </View>
        );
      }
    );
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          {/*space*/}
          <View style={{ padding: `${0.006 * width}%` }} />

          {/*Found a match Text*/}
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontWeight: "normal",
                fontSize: 0.053 * width,
                color: "#fff"
              }}
            >
              Found a Match!
            </Text>

            <Text />

            <View
              style={{
                width: 0.53 * width,
                fontWeight: "normal",
                fontSize: 0.053 * width
              }}
            >
              <Text
                style={{
                  fontWeight: "normal",
                  fontSize: 0.042 * width,
                  color: "#fff",
                  textAlign: "center"
                }}
              >
                You've got 90 seconds to get to know you match.
              </Text>
            </View>

            {/*space*/}
            <View style={{ padding: `${0.026 * width}%` }} />

            {/*match user info box*/}
            <Card style={styles.card}>
              <View style={styles.imageWrap}>
                <Image
                  blurRadius={10}
                  source={{
                    uri: this.state.matchImageUrl
                  }}
                  style={styles.image}
                />
              </View>

              {/*space*/}
              <View style={{ alignItems: "center", bottom: 25 }}>
                {/*match user info*/}
                <Text style={{ fontSize: 0.042 * width }}>
                  {this.state.matchFirstName}, {this.state.matchLastName}
                </Text>
                <Text> {this.state.matchMiles} miles away </Text>
              </View>

              {/**border line */}
              <View
                style={{
                  borderWidth: 1,
                  width: 0.8 * width,
                  borderColor: "#4d88ff",
                  marginLeft: "1%",
                  marginRight: "1%",
                  alignSelf: "center"
                }}
              />

              <View style={{ padding: `${0.008 * width}%` }} />

              <View style={{ left: "1%" }}>
                <Text>Interests</Text>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {displayMatchedLikesArray}
              </View>
            </Card>

            <TouchableOpacity
              style={{
                alignItems: "center",
                borderWidth: 1,
                borderRadius: 0.06 * width,
                paddingLeft: 0.26 * width,
                paddingRight: 0.26 * width,
                paddingTop: 0.026 * width,
                paddingBottom: 0.026 * width,
                margin: 0.04 * width,
                backgroundColor: "purple"
              }}
              onPress={() => {
                this.setDeviceUserAccept();
              }}
            >
              {/*Testing Use*/}
              <Text style={{ color: "white" }}> I'm Ready</Text>
            </TouchableOpacity>
          </View>
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
  likeButtonWrap: {
    alignItems: "center",
    paddingLeft: 0.026 * width,
    paddingRight: 0.026 * width,
    paddingTop: 7.5,
    paddingBottom: 7.5,
    width: "auto",
    borderRadius: 0.106 * width,
    borderWidth: 2,
    backgroundColor: "rgb(67, 33, 140)",
    borderColor: "#fff",
    margin: 0.013 * width
  },
  card: {
    backgroundColor: "#e2dcff",
    borderColor: "white",
    borderRadius: 10,
    borderWidth: 6,
    width: width * 0.86,
    height: width * 0.7,
    alignItems: "center"
  },
  likeButton: {
    color: "#fff",
    fontSize: 0.045 * width
  },
  image: {
    width: 0.2 * width,
    height: 0.2 * width,
    borderRadius: 0.098 * width,
    alignSelf: "center",
    top: 5
  },
  imageWrap: {
    alignSelf: "center",
    backgroundColor: "#e2dcff",
    borderColor: "#fff",
    borderWidth: 6,
    bottom: 0.13 * width,
    width: 0.26 * width,
    height: 0.26 * width,
    borderRadius: 0.13 * width
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetTimeAction: payload => dispatch(SetTimeAction(payload)),
    SetNewMatchlistAction: payload => dispatch(SetNewMatchlistAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoundaMatch);
