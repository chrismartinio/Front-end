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
  Picker,
  TextInput,
  Dimensions
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient'

// import Categories from '../../components/SignUpFlow/Categories'
import t from "tcomb-form-native";
import { connect } from "react-redux";
//import SetWeekendLocationDataAction from "../../../../storage/actions/SetWeekendLocationDataAction";
//import RemoveWeekendLocationDataAction from "../../../../storage/actions/RemoveWeekendLocationDataAction";
import firebase from "../../../../utils/mainFire";
import Slider from "../CSlider";

class SignupPage extends React.Component {
  static navigationOptions = {
    //header: null,
    //title: 'Match Chat',
    headerStyle: {
      backgroundColor: "#18cdf6"
    },
    footerStyle: {
      backgroundColor: "#fff"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 24
    }
  };

  //having null header means no back  button is present!
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      places: [
        "loading",
        "loading",
        "loading",
        "loading",
        "loading",
        "loading",
        "loading"
      ]
    };
  }

  //header : navigate to sign in screen
  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  handleListener = arg => {
    //console.log(arg)
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      let data = await fetch(
        "http://10.0.0.246:3000/api/onboarding/spendAWeekend",
        {
          method: "POST",
          mode: "cors",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password: "password",
            username: "name"
          })
        }
      );

      let jsonData = await data.json();
      this.setState({
        places: jsonData
      });
    } catch (e) {
      console.log("failed toload data", e);
    }
  };

  handlPress = location => {
    if (
      this.props.CreateProfileReducer.weekendLocation.indexOf(location) !== -1
    ) {
      this.props.RemoveWeekendLocationDataAction(location);
    } else {
      this.props.SetWeekendLocationDataAction(location);
    }
  };

  handlSubmit = () => {
    if (this.props.CreateProfileReducer.weekendLocation.length > 0) {
      //Navigate to Next Screen
      //this.props.navigation.navigate("TestSignUp");
      console.log("Passed");
    } else {
      //Add Warning here?
      console.log("empty location");
      return;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          textStyle={{ color: "#fff" }}
          colors={["#18cdf6", "#43218c"]}
          style={{ flex: 1 }}
        >
          <ScrollView>
            <Text style={styles.titleText}>Spend a weekend</Text>
            <View alignItems="center">
              <Text style={styles.text}>based on your location...</Text>
            </View>
            <View
              style={{ margin: 10, color: "#fff", width: "80%", left: "10%" }}
            >
              <View alignItems="center">
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.indexOf(
                      "San Francisco"
                    ) === -1
                      ? styles.button1
                      : styles.pickedbutton1
                  }
                  onPress={() => this.handlPress("San Francisco")}
                >
                  <Text style={styles.button}>San Francisco</Text>
                </TouchableOpacity>
                <Text />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.indexOf(
                      "Tahoe"
                    ) === -1
                      ? styles.button2
                      : styles.pickedbutton2
                  }
                  onPress={() => this.handlPress("Tahoe")}
                >
                  <Text style={styles.button}>Tahoe</Text>
                </TouchableOpacity>
                <Text> </Text>
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.indexOf(
                      "Monterey"
                    ) === -1
                      ? styles.button2
                      : styles.pickedbutton2
                  }
                  onPress={() => this.handlPress("Monterey")}
                >
                  <Text style={styles.button}>Monterey</Text>
                </TouchableOpacity>
              </View>
              <Text />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.indexOf(
                      "Big Sur"
                    ) === -1
                      ? styles.button2
                      : styles.pickedbutton2
                  }
                  onPress={() => this.handlPress("Big Sur")}
                >
                  <Text style={styles.button}>Big Sur</Text>
                </TouchableOpacity>
                <Text> </Text>
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.indexOf(
                      "Napa"
                    ) === -1
                      ? styles.button2
                      : styles.pickedbutton2
                  }
                  onPress={() => this.handlPress("Napa")}
                >
                  <Text style={styles.button}>Napa</Text>
                </TouchableOpacity>
              </View>
              <Text />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.indexOf(
                      "Santa Cruz"
                    ) === -1
                      ? styles.button2
                      : styles.pickedbutton2
                  }
                  onPress={() => this.handlPress("Santa Cruz")}
                >
                  <Text style={styles.button}>Santa Cruz</Text>
                </TouchableOpacity>
                <Text> </Text>
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.indexOf(
                      "Yosemite"
                    ) === -1
                      ? styles.button2
                      : styles.pickedbutton2
                  }
                  onPress={() => this.handlPress("Yosemite")}
                >
                  <Text style={styles.button}>Yosemite</Text>
                </TouchableOpacity>
              </View>
              <Text />
              <View alignItems="center">
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.indexOf(
                      "Morro Bay"
                    ) === -1
                      ? styles.button1
                      : styles.pickedbutton1
                  }
                  onPress={() => this.handlPress("Morro Bay")}
                >
                  <Text style={styles.button}>Morro Bay</Text>
                </TouchableOpacity>
              </View>
              <View alignItems="center" top={75}>
                <TouchableOpacity
                  style={
                    this.props.CreateProfileReducer.weekendLocation.length > 0
                      ? styles.passedNextButton
                      : styles.nextButton
                  }
                  onPress={this.handlSubmit}
                >
                  <Text style={styles.button}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleText: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "100"
  },
  titleText2: {
    margin: 10,
    color: "#fff",
    fontSize: 48,
    top: 25,
    textAlign: "center"
  },
  _textInput: {
    color: "#fff",
    fontSize: 20,
    textAlign: "left",
    paddingTop: "20%",
    borderBottomWidth: 1,
    borderColor: "#fff"
  },
  smallText: {
    margin: 10,
    color: "#fff",
    fontSize: 10
  },
  text: {
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  textTop: {
    //top: 40,
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  textTop2: {
    // top: 60,
    margin: 10,
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  button: {
    color: "#fff",
    fontSize: 20
  },
  button1: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "65%"
  },
  pickedbutton1: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "65%",
    backgroundColor: "green"
  },
  nextButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "65%"
  },
  passedNextButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "65%",
    backgroundColor: "green"
  },
  button2: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "45%"
  },
  pickedbutton2: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "45%",
    backgroundColor: "green"
  },
  slider1: {
    top: 60
  },
  slider2: {
    top: 80
  },
  slider3: {
    top: 15
  }
});
const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  SetWeekendLocationDataAction: payload =>
    dispatch(SetWeekendLocationDataAction(payload)),
  RemoveWeekendLocationDataAction: payload =>
    dispatch(RemoveWeekendLocationDataAction(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupPage);
