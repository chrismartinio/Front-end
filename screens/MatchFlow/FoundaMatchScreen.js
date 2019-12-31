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

class MatchScreen extends React.Component {
  //Header

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      isDeviceUserReady: false,
      isMatchUserReady: false,
      matchingUserGuid: "",
      matchingFirstName: "",
      matchingLastName: "",
      matchingLikesArray: [],
      matchingImage: "",
      matchingMiles: ""
    };
    //Socket
    //receive socket roomID
    //and set isMatchUserReady to true
  }

  setMatchingUser = match => {
    this.setState({
      matchingUserGuid: this.props.navigation.state.params.matchingUserGuid,
      matchingRoomGuid: this.props.navigation.state.params.matchingRoomGuid,
      matchingFirstName: match.firstName,
      matchingLastName: match.lastName,
      matchingLikesArray: match.likesArray,
      matchingImage: match.imageUrl,
      matchingMiles: "4.26",
      matchingAge: this.calculateAge(match.birthDate),
      matchingLocation: match.city,
      matchingState: match.state,
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

  componentDidMount() {
    //reset the matchingScreen's foundaMatch = false
    //fetch data
    //and use guid to get interest, miles, firstName, lastName, image
    axios
      .post(
        `http://${miniServer}:4000/api/profile/profile_query`,
        {
          guid: this.props.navigation.state.params.matchingUserGuid,
          collection: "aboutYou"
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(response => {
        this.setMatchingUser(response.data.result);
      })
      .catch(error => {
        console.log("Error: ", error);
        return this.props.navigation.navigate("Home");
      });
  }

  setUserReady = () => {
    this.setState(
      {
        isDeviceUserReady: true
      },
      () => {
        console.log(this.state.isDeviceUserReady);
        console.log(this.state.isMatchUserReady);
      }
    );
    //Send Socket
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevState.isDeviceUserReady !== this.state.isDeviceUserReady ||
      prevState.isMatchUserReady !== this.state.isMatchUserReady
    ) {
      //Testing use
      this.props.navigation.navigate("MinuteChatRoom", {
        matchingInfo: this.state
      });
      //Testing use

      if (this.state.isDeviceUserReady && this.state.isMatchUserReady) {
        //also send a private room id to match screen
        this.props.navigation.navigate("MinuteChatRoom", {
          matchingInfo: this.state
        });
      }
    }
  }

  successScreen = () => {
    let displayMatchedLikesArray = this.state.matchingLikesArray.map(
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

            {/*matching user info box*/}
            <Card style={styles.card}>
              <View style={styles.imageWrap}>
                <Image
                  blurRadius={10}
                  source={{
                    uri: this.state.matchingImage
                  }}
                  style={styles.image}
                />
              </View>

              {/*space*/}
              <View style={{ alignItems: "center", bottom: 25 }}>
                {/*matching user info*/}
                <Text style={{ fontSize: 0.042 * width }}>
                  {this.state.matchingFirstName}, {this.state.matchingLastName}
                </Text>
                <Text> {this.state.matchingMiles} miles away </Text>
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
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchScreen);
