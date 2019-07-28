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
  TextInput,
  Picker,
  DatePickerIOS,
  TouchableHighlight,
  SafeAreaView
} from "react-native";
import { LinearGradient } from "expo";
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";
import { connect } from "react-redux";
//import SetProfileLikesAction from "../../storage/actions/SetProfileLikesAction";
//import SetProfileFirstLike from "../../storage/actions/SetProfileFirstLike";
import SetProfileLikesAction from "../../../storage/actions/SetProfileLikesAction";
import SetProfileFirstLike from "../../../storage/actions/SetProfileFirstLike";
import RemoveProfileLikesAction from "../../../storage/actions/RemoveProfileLikesAction";
import { Icon } from "react-native-elements";

class TellUsMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passed: false
    };
    this.inputRefs = {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //if there have any udpate to the warnings by checking this.state and prevState
    //then call the allChecker()
    //allCheck will check if there any warnings
    //If there have warnings: button show transparent (passed)
    //If there have no warnings: button show green (passed)

    if (
      prevProps.CreateProfileReducer.likes !==
      this.props.CreateProfileReducer.likes
    ) {
      this.allChecker();
      //any changes will remove the check mark from CollapsibleComponent CheckMark
      this.props.handlePassed("interests", false);
    }
  }

  handleSubmit = () => {
    if (this.state.passed) {
      this.props.handlePassed("interests", true);
    } else {
      this.props.handlePassed("interests", false);
    }
  };

  likesChecker = () => {
    if (this.props.CreateProfileReducer.likes.length >= 3) {
      return true;
    }
    return false;
  };

  allChecker = () => {
    if (this.likesChecker()) {
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

  handleRedux = name => {
    const likes = this.props.CreateProfileReducer.likes;
    //console.log(name);
    // replacing initial state
    if (likes[0] === null) {
      return this.props.SetProfileFirstLike(name);
    }

    // blocks duplicates
    if (likes.indexOf(name) !== -1) {
      return this.props.RemoveProfileLikesAction(name);
    }

    this.props.SetProfileLikesAction(name);
  };

  render() {
    let invalidLikesWarning = (
      <View style={{ alignItems: "center" }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Icon
            type="font-awesome"
            name="exclamation-circle"
            color="#fff"
            iconStyle={{ top: 3 }}
          />
          <Text style={styles.warningText}>
            {"   "}Please select 3 interests
          </Text>
        </View>
      </View>
    );

    let displaylikes = likes.map((e, index = 0) => {
      return (
        <TouchableOpacity
          key={index++}
          style={[
            styles.likeButtonWrap,
            {
              backgroundColor:
                this.props.CreateProfileReducer.likes.indexOf(e) === -1
                  ? "transparent"
                  : "green"
            }
          ]}
          onPress={() => this.handleRedux(e)}
        >
          <Text style={styles.likeButton}>{e}</Text>
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
          <Text style={{ color: "white", fontSize: 24 }}>
            I'm interested in
          </Text>
          <Text />
          <Text style={{ opacity: 0.7, color: "white" }}>Pick at least 3</Text>
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
        <View style={styles.likeWrapCenter}>
          <View style={styles.likesWrap}>{displaylikes}</View>
        </View>
        <Text />
        {this.props.CreateProfileReducer.likes.length < 3 &&
          invalidLikesWarning}
        {/*Spaces*/}
        <View
          style={{
            padding: "7%"
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

const styles = StyleSheet.create({
  likeButton: {
    color: "#fff",
    fontSize: 20
  },
  likeButtonWrap: {
    alignItems: "center",
    padding: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "auto",
    minWidth: "25%",
    margin: 5
  },
  likeButtonWrapBack: {
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    //width: "33%",
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
  likesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  likeWrapCenter: {
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

const likes = [
  "Food",
  "Dancing",
  "Pets",
  "Gym",
  "Shopping",
  "Sports",
  "Hiking",
  "Music",
  "Travel"
];

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetProfileLikesAction: payload => dispatch(SetProfileLikesAction(payload)),
    SetProfileFirstLike: payload => dispatch(SetProfileFirstLike(payload)),
    RemoveProfileLikesAction: payload =>
      dispatch(RemoveProfileLikesAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TellUsMore);
