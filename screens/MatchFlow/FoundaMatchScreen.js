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
import { miniServer, localhost } from "../../config/ipconfig";
import axios from "axios";
import { connect } from "react-redux";
import LoadingScreen from "../../sharedComponents/LoadingScreen";
import Footer from "../../sharedComponents/Footer";
import { Card } from "react-native-paper";
import { testobj } from "../../data/testObj";
const { height, width } = Dimensions.get("window");
import SetTimeAction from "../../storage/actions/ConfigReducerActions/SetTimeAction/";

class MatchScreen extends React.Component {
  //Header

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      isDeviceUserReady: false,
      isMatchUserReady: false,
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
    //Socket
    //receive socket roomID
    //and set isMatchUserReady to true
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
    fetch(`http://${localhost}:4080/api/frontendconfig/query`, {
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
    //reset the matchScreen's foundaMatch = false
    //fetch data
    //and use guid to get interest, miles, firstName, lastName, image

    axios
      .post(
        `http://${localhost}:4000/api/profile/chat_query`,
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

  setUserReady = () => {
    this.setState({
      isDeviceUserReady: true
    });
    //Send Socket
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.isDeviceUserReady !== this.state.isDeviceUserReady ||
      prevState.isMatchUserReady !== this.state.isMatchUserReady
    ) {
      //Testing use
      //no Socket setup yet, so have this for now
      this.props.navigation.navigate("MinuteChatRoom", this.state);
      //Testing use

      if (this.state.isDeviceUserReady && this.state.isMatchUserReady) {
        this.props.navigation.navigate("MinuteChatRoom", this.state);
      }
    }
  }

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
                this.setUserReady();
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
    borderRadius: 37,
    alignSelf: "center",
    top: 5
  },
  imageWrap: {
    alignSelf: "center",
    backgroundColor: "#e2dcff",
    borderColor: "#fff",
    borderWidth: 6,
    bottom: 50,
    width: 0.26 * width,
    height: 0.26 * width,
    borderRadius: 0.13 * width
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return { SetTimeAction: payload => dispatch(SetTimeAction(payload)) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchScreen);
