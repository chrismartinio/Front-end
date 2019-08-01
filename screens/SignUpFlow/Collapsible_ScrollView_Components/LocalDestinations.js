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
import { LinearGradient } from "expo";
// import Categories from '../../components/SignUpFlow/Categories'
import t from "tcomb-form-native";
import { connect } from "react-redux";
import SetWeekendLocationDataAction from "../../../storage/actions/SetWeekendLocationDataAction";
import RemoveWeekendLocationDataAction from "../../../storage/actions/RemoveWeekendLocationDataAction";
import { Icon } from "react-native-elements";

class LocationDestinations extends React.Component {
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
      ],
      passed: false
    };
  }

  //header : navigate to sign in screen
  handleBackToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  handleListener = arg => {
    //console.log(arg)
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)

    if (
      prevProps.CreateProfileReducer.weekendLocation !==
      this.props.CreateProfileReducer.weekendLocation
    ) {
      this.allChecker();
      //any changes will remove the check mark from CollapsibleComponent CheckMark
      this.props.handlePassed("localDestinations", false);
    }
  }

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

  locationsChecker = () => {
    if (this.props.CreateProfileReducer.weekendLocation.length === 1) {
      return true;
    }
    return false;
  };

  allChecker = () => {
    if (this.locationsChecker()) {
      this.setState(
        {
          passed: true
        },
        () => {
          console.log("passed");
        }
      );
    } else {
      this.setState(
        {
          passed: false
        },
        () => {
          console.log("not passed");
        }
      );
    }
  };

  handleSubmit = () => {
    if (this.state.passed) {
      this.props.handlePassed("localDestinations", true);
    } else {
      this.props.handlePassed("localDestinations", false);
    }
  };

  render() {
    let emptyCityWarning = (
      <View style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Icon
            type="font-awesome"
            name="exclamation-circle"
            color="#fff"
            iconStyle={{ top: 3 }}
          />
          <Text style={styles.warningText}>{"   "}Please select a city</Text>
        </View>
      </View>
    );

    let displayLocation = locations.map((e, index = 0) => {
      return (
        <TouchableOpacity
          key={index++}
          style={[
            styles.locationsButtonWrap,
            {
              backgroundColor:
                this.props.CreateProfileReducer.weekendLocation.indexOf(e) ===
                -1
                  ? "transparent"
                  : "white",
              minWidth:
                e === "San Francisco" || e === "Morro Bay" ? "50%" : "45%"
            }
          ]}
          onPress={() => this.handlPress(e)}
        >
          <Text
            style={[
              styles.locationsButton,
              {
                color:
                  this.props.CreateProfileReducer.weekendLocation.indexOf(e) ===
                  -1
                    ? "white"
                    : "#43218c"
              }
            ]}
          >
            {e}
          </Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={{ flex: 1 }}>
        {/*Spaces*/}
        <View
          style={{
            padding: "5%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
        {/*I'm interested in Text & Pick one of both Text*/}
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 24 }}>Spend a weekend</Text>
          <Text />
          <Text style={{ opacity: 0.7, color: "white" }}>Pick 1</Text>
          {/*Spaces*/}
          <View
            style={{
              padding: "5%"
              //borderRadius: 4,
              //borderWidth: 0.5,
              //borderColor: "#d6d7da"
            }}
          />
        </View>

        {/*likes*/}
        <View style={styles.locationsWrapCenter}>
          <View style={styles.locationsWrap}>{displayLocation}</View>
        </View>
        <Text />
        {this.props.CreateProfileReducer.weekendLocation.length !== 1 &&
          emptyCityWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "10%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
        {/*Next Button*/}
        <View
          alignItems="center"
          style={{ opacity: this.state.passed ? 1.0 : 0.5 }}
        >
          <TouchableOpacity
            style={styles.nextButton}
            onPress={this.handleSubmit}
            disabled={!this.state.passed}
          >
            <Text style={styles.button}>Next</Text>
          </TouchableOpacity>
        </View>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
            //borderRadius: 4,
            //borderWidth: 0.5,
            //borderColor: "#d6d7da"
          }}
        />
      </View>
    );
  }
}
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  locationsButton: {
    color: "#fff",
    fontSize: 20
  },
  locationsButtonWrap: {
    alignItems: "center",
    padding: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "auto",
    minWidth: "45%",
    margin: 5
  },
  button: {
    color: "#fff",
    fontSize: 20
  },
  nextButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  },
  locationsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  locationsWrapCenter: {
    alignItems: "center"
    //marginTop: "15%"
  },
  warningText: {
    color: "#fff",
    fontSize: 10,
    paddingTop: "3%",
    fontWeight: "bold"
  }
});

const locations = [
  "San Francisco",
  "Tahoe",
  "Monterey",
  "Big Sur",
  "Napa",
  "Santa Cruz",
  "Yosemite",
  "Morro Bay"
];

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
)(LocationDestinations);
