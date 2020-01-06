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
  Image
} from "react-native";
import { miniServer } from "../../config/ipconfig";
import axios from "axios";
import { connect } from "react-redux";
import LoadingScreen from "../../sharedComponents/LoadingScreen";
import Footer from "../../sharedComponents/Footer";
import { Card } from "react-native-paper";
import { testobj } from "../../data/testObj";
const { height, width } = Dimensions.get("window");

class AcceptMatchingScreen extends React.Component {
  //Header

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: true,
      modalVisible: false,
      matchUserGuid: "",
      matchFirstName: "",
      isDeviceUserAccept: false,
      isMatchUserAccept: false,
      isMatchUserClicked: false,
      matchImageUrl:
        "https://cdn.pixabay.com/photo/2016/03/31/15/33/contact-1293388_960_720.png"
    };
    //setup socket to get matching user accept/reject
    //socket.on
    //this.setState({isMatchedUserClicked: true})
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
      prevState.isMatchUserAccept !== this.state.isMatchUserAccept
    ) {
      //Testing use
      this.acceptMatchingUser();
      //Testing use

      //if matching user click reject and also check if they clicked once
      //isMatchUserAccept is set to false by default
      //so need to check the matching user has clicked at least one or not
      if (
        this.state.isMatchUserAccept === false &&
        this.state.isMatchUserClicked
      ) {
        console.log("Match Reject");
        return this.rejectMatchingUser();
      }

      //if both users click accept
      if (this.state.isDeviceUserAccept && this.state.isMatchUserAccept) {
        console.log("Both Accept");
        return this.acceptMatchingUser();
      }
    }
  }

  componentDidMount() {
    this.setMatchingUserInfo(this.props.navigation.state.params);
  }

  setDeviceUserAccept = () => {
    console.log("Accept");
    //emit socket for accept

    //setState
    this.setState({
      isDeviceUserAccept: true
    });
  };

  setDeviceUserReject = () => {
    console.log("Device Reject");
    //emit socket for reject

    //setState
    this.setState({
      isDeviceUserAccept: false
    });
    return this.rejectMatchingUser();
  };

  rejectMatchingUser = () => {
    console.log("reject");
    //do something for ghosting
    this.props.navigation.navigate("Home");
  };

  acceptMatchingUser = () => {
    console.log("accept");
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
    this.props.navigation.navigate(
      "PermanentChatRoom",
      this.props.navigation.state.params
    );
  };

  successScreen = () => {
    return (
      <View style={styles.container}>
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

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 0.064 * width, fontWeight: "bold", color: "white" }}>
            Congrats!
          </Text>
          <Text style={{ color: "white", fontSize: 0.053 * width }}>
            {`You and ${this.state.matchFirstName} must like each other.`}
          </Text>
          <Text style={{ color: "white", fontSize: 0.053 * width }}>
            You had a 90 second convo!
          </Text>
        </View>

        <View style={{ padding: `${0.026 * width}%` }} />

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button
            title={"Reject"}
            color={"white"}
            style={{ borderWidth: 1, borderColor: "white" }}
            onPress={() => {
              this.setDeviceUserReject();
            }}
          />
          <Button
            title={"Accept"}
            color={"white"}
            style={{ borderWidth: 1, borderColor: "white" }}
            onPress={() => {
              this.setDeviceUserAccept();
            }}
          />
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
