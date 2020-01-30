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
import { server_chat } from "../../config/ipconfig";
import axios from "axios";
import { connect } from "react-redux";
import LoadingScreen from "../../sharedComponents/LoadingScreen";
import Footer from "../../sharedComponents/Footer";
import { Card } from "react-native-paper";
const { height, width } = Dimensions.get("window");
import io from "socket.io-client";
import { Icon } from "react-native-elements";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Constants from "expo-constants";

//Because this is navigation stack, previous screen won't call componentWillUnmount, so won't close socket
//this.socket.close();
//Device user presses Back -> setDeviceUserReject -> Home
//Device user presses Ghost -> setDeviceUserReject -> Home
//Match user presses Ghost -> this.socket.on("ghostChat") -> componentDidUpdate -> backToHome -> Home
//Device & Match press Accept -> this.socket.on("acceptChat") -> componentDidUpdate -> bothAccept -> Permanent

class AcceptMatchingScreen extends React.Component {
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
      isSuccess: true,
      modalVisible: false,
      matchUserGuid: "",
      matchFirstName: "",
      isDeviceUserAccept: false,
      isDeviceUserClicked: false,
      isMatchUserAccept: false,
      isMatchUserClicked: false,
      matchImageUrl:
        "https://cdn.pixabay.com/photo/2016/03/31/15/33/contact-1293388_960_720.png"
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

      this.setState({ isMatchUserClicked: true, isMatchUserAccept: false });
    });

    //handle ghost
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

  setMatchingUserInfo = match => {
    this.setState({
      matchUserGuid: match.matchUserGuid,
      matchFirstName: match.matchFirstName,
      matchImageUrl: match.matchImageUrl
    });
  };

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

  componentDidMount() {
    this.roomGuid = this.props.navigation.state.params.matchRoomGuid;
    this.setMatchingUserInfo(this.props.navigation.state.params);

    //exit button
    this.props.navigation.setParams({
      backToHome: () => {
        this.setDeviceUserReject();
      }
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  setDeviceUserAccept = () => {
    console.log("Accept");
    //emit socket for accept
    this.socket.emit("vote", {
      voteData: "matched",
      userGuid: this.props.CreateProfileDataReducer.guid,
      matchedUserGuid: this.state.matchUserGuid
    });

    //setState
    this.setState({
      isDeviceUserAccept: true,
      isDeviceUserClicked: true
    });
  };

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
    console.log("Both Accept, Directing to PermanentChatRoom");
    let {
      matchAge,
      matchFirstName,
      matchLocation,
      matchUserGuid,
      matchLikesArray,
      matchState,
      matchImageUrl,
      matchRoomGuid
    } = this.props.navigation.state.params;
    Alert.alert(
      "Yes!",
      `${this.state.matchFirstName} accpeted you! ${
        this.state.matchFirstName
      } want to continue to chat with you.`,
      [
        {
          text: "OK",
          onPress: () => {
            this.socket.close();
            this.props.navigation.navigate(
              "PermanentChatRoom",
              this.props.navigation.state.params
            );
          }
        }
      ],
      { cancelable: false }
    );
  };

  successScreen = () => {
    return (
      <View style={styles.container}>
        {/*Image*/}
        <View
          style={{
            padding: width >= 375 ? `${0.026 * width}%` : `${0.013 * width}%`
          }}
        />
        <Image
          blurRadius={20}
          source={{
            uri: this.state.matchImageUrl
          }}
          style={{
            width: 0.8 * width,
            height: 0.8 * width,
            borderRadius: 0.4 * width,
            alignSelf: "center"
          }}
        />

        <View style={{ padding: `${0.013 * width}%` }} />

        {/*Text*/}
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 0.064 * width,
              fontWeight: "bold",
              color: "white"
            }}
          >
            Congrats!
          </Text>
          <Text style={{ color: "white", fontSize: 0.053 * width }}>
            {`You and ${this.state.matchFirstName} must like each other.`}
          </Text>
          <Text style={{ color: "white", fontSize: 0.053 * width }}>
            You had a 90 second convo!
          </Text>
        </View>

        <View style={{ padding: `${0.013 * width}%` }} />

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {/*Reject/Ghost Button*/}
          <TouchableOpacity
            onPress={() => this.setDeviceUserReject()}
            style={{
              borderWidth: 0.5,
              borderRadius: 50,
              borderColor: "#fff",
              paddingLeft: 25,
              paddingRight: 25,
              paddingTop: 15,
              paddingBottom: 15,
              backgroundColor:
                !this.state.isDeviceUserAccept && this.state.isDeviceUserClicked
                  ? "#fff"
                  : "transparent"
            }}
          >
            <FontAwesome5
              color={"white"}
              name={"ghost"}
              size={width * 0.15}
              solid
            />
          </TouchableOpacity>

          {/*Accept Button*/}
          <TouchableOpacity
            onPress={() => this.setDeviceUserAccept()}
            style={{
              borderWidth: 0.5,
              borderRadius: 50,
              borderColor: "#fff",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: this.state.isDeviceUserAccept
                ? "#fff"
                : "transparent"
            }}
          >
            <FontAwesome5
              color={"pink"}
              name={"heart"}
              size={width * 0.15}
              solid
              style={{ top: 10 }}
            />
          </TouchableOpacity>
        </View>
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
)(AcceptMatchingScreen);
