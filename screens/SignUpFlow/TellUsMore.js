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
  TouchableHighlight
} from "react-native";
import { LinearGradient } from "expo";
import DatePicker from "react-native-datepicker";
import RNPickerSelect from "react-native-picker-select";

class TellUsMore extends React.Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient colors={["#18cdf6", "#43218c"]} style={{ flex: 1 }}>
          <ScrollView>
            <View
              style={{
                marginLeft: "5%",
                marginRight: "5%",
                marginTop: "40%",
                marginBottom: "10%"
              }}
            >
              {/**Tell Us More Text */}
              <View style={styles.tellUsMoreTextWrap}>
                <Text style={styles.tellUsMoreText}>Tell Us More</Text>
                {/** What are you into? Text*/}
                <Text style={styles.whatAreYouIntoText}>
                  What are you into?
                </Text>
              </View>
              {/*First 3 likes*/}
              <View
                style={{
                  alignItems: "center",
                  marginTop: "15%",
                }}
              >
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Food</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Dancing</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Pets</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/*Second 3 likes*/}
              <View
                style={{
                  alignItems: "center",
                  marginTop: "5%",
                }}
              >
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Gym</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Shopping</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Sports</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/*Thir 3 likes*/}
              <View
                style={{
                  alignItems: "center",
                  marginTop: "5%",
                }}
              >
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Hiking</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Music</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.likeButtonWrap}
                    onPress={this.handlPress}
                  >
                    <Text style={styles.likeButton}>Travel</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View alignItems="center" top={"30%"}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleSubmit}
                >
                  <Text style={{ color: "#fff" }}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tellUsMoreText: {
    color: "#fff",
    fontSize: 45
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
    //backgroundColor: '#fff',
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "70%"
  },
  buttonText: {
    padding: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
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

export default TellUsMore;
