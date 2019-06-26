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
import SetProfileLikesAction from "../../storage/actions/SetProfileLikesAction";
import SetProfileFirstLike from "../../storage/actions/SetProfileFirstLike";

class TellUsMore extends React.Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
  }
  handleSubmit = () => {
    this.props.navigation.navigate("TestImInterestedIn");
  };

  handleRedux = name => {
    const likes = this.props.CreateProfileReducer.likes;
    //console.log(name);

    // replacing initial state
    if (likes[0] === null) {
      return this.props.SetProfileFirstLike(name);
    }
    // blocks duplicates
    for (let i = 0; i < likes.length; i++) {
      if (likes[i] === name) {
        return;
      }
    }
    this.props.SetProfileLikesAction(name);

    //after clicked, gray the buttons
    //copy categories.js
  };

  render() {
    let displaylikes = likes.map((e, index = 0) => {
      return (
        <TouchableOpacity
          key={index++}
          style={styles.likeButtonWrap}
          onPress={() => this.handleRedux(e)}
        >
          <Text style={styles.likeButton}>{e}</Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={{ flex: 1 }}>
        <LinearGradient colors={["#18cdf6", "#43218c"]} style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.wholeWrap}>
              {/**Tell Us More Text */}
              <View style={styles.tellUsMoreTextWrap}>
                <Text style={styles.tellUsMoreText}>Tell Us More</Text>
                {/** What are you into? Text*/}
                <Text style={styles.whatAreYouIntoText}>
                  What are you into?
                </Text>
              </View>
              <View style={styles.likeWrapCenter}>
                <View style={styles.likesWrap}>{displaylikes}</View>
              </View>
            </View>
            <View alignItems="center" top={"20%"}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSubmit}
              >
                <Text style={{ color: "#fff" }}>Next</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tellUsMoreText: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "100"
  },
  whatAreYouIntoText: {
    color: "#fff",
    paddingTop: "5%",
    fontSize: 20
  },
  tellUsMoreTextWrap: {
    alignItems: "center"
  },
  likeButton: {
    color: "#fff",
    fontSize: 20
  },
  likeButtonWrap: {
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#fff",
    //width: "30%",
    margin: "1%"
  },
  button: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "70%"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  likesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  likeWrapCenter: {
    alignItems: "center",
    marginTop: "15%"
  },
  wholeWrap: {
    //borderRadius: 4,
    //borderWidth: 0.5,
    //borderColor: "#d6d7da",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "40%"
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
    SetProfileFirstLike: payload => dispatch(SetProfileFirstLike(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TellUsMore);
