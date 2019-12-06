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

import { connect } from "react-redux";

import LoadingScreen from "../../sharedComponents/LoadingScreen";

import NotificationButton from "../../sharedComponents/NotificationButton";

import Footer from "../../sharedComponents/Footer";

class MatchScreen extends React.Component {
  //Header

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: true,
      isDeviceUserReady: false,
      isMatchUserReady: false
    };
    //Socket
    //receive socket roomID
    //and set isMatchUserReady to true
  }

  componentDidMount() {
    //reset the matchingScreen's foundaMatch = false
    this.props.navigation.state.params.backFromMatch();
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
      if (this.state.isDeviceUserReady && this.state.isMatchUserReady) {
        //also send a private room id to match screen
        this.props.navigation.navigate("MinuteChatRoom");
      }
    }
  }

  successScreen = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9 }}>
          {/*space*/}
          <View style={{ padding: "15%" }} />

          {/*Found a match Text*/}
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text>Found a Match!</Text>
            <View style={{ width: 200 }}>
              <Text>You've got 90 seconds to get to know you match.</Text>
            </View>

            {/*space*/}
            <View style={{ padding: "10%" }} />

            {/*matched user info box*/}
            <View
              style={{
                alignItems: "center",
                borderWidth: 1,
                color: "black",
                borderRadius: 15,
                width: 300
              }}
            >
              <Image
                source={{
                  uri:
                    "https://www.famousbirthdays.com/faces/efron-zac-image.jpg"
                }}
                style={{ width: 75, height: 75, borderRadius: 30 }}
              />

              {/*space*/}
              <View style={{ padding: "3%" }}>
                {/*matched user info*/}
                <Text style={{ fontSize: 16 }}>Salma W</Text>
                <Text> 3.2 miles away </Text>
              </View>

              {/**border line */}
              <View
                style={{
                  borderWidth: 1,
                  width: 200,
                  borderColor: "#d6d7da"
                }}
              />

              <View>
                <Text>Interests</Text>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <Button title={"A"} color={"black"} />
                <Button title={"B"} color={"black"} />
                <Button title={"C"} color={"black"} />
              </View>
            </View>

            <TouchableOpacity
              style={{
                alignItems: "center",
                borderWidth: 1,
                borderRadius: 25,
                paddingLeft: 100,
                paddingRight: 100,
                paddingTop: 10,
                paddingBottom: 10,
                margin: 15,
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

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
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
