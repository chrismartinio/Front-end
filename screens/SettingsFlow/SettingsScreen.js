import React from "react";
import { ExpoConfigView } from "@expo/samples";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert
} from "react-native";

import { connect } from "react-redux";

import { localhost } from "../../config/ipconfig";

const { height, width } = Dimensions.get("window");

var jwtDecode = require("jwt-decode");

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  deleteAccount = () => {
    console.log("delete Account");
    fetch(`http://${localhost}:4000/api/profile/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          Alert.alert(
            "Success!",
            "Your Account is deleted. Good Bye!",
            [
              {
                text: "OK",
                onPress: () => {
                  this.props.navigation.navigate("Login");
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          throw new Error("Internal Error ");
        }
      })
      .catch(err => {
        alert("Ops! Some error occured. Please try again!");
      });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        {/*Sign up Blindly Account
          Only Visible to Third Party User
          */}
        {this.props.CreateProfileDataReducer.isThirdPartiesServiceUser && (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              margin: 10
            }}
            onPress={() => {
              this.props.navigation.navigate("CreateBlindlyAccount");
            }}
          >
            <Text style={{ color: "black" }}> Sign up a Blindly Account </Text>
          </TouchableOpacity>
        )}

        {/*Chnage Password
          Only Visible to Local
          */}

        {!this.props.CreateProfileDataReducer.isThirdPartiesServiceUser && (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              margin: 10
            }}
            onPress={() => {
              this.props.navigation.navigate("ChangePassword");
            }}
          >
            <Text style={{ color: "black" }}> Change my password </Text>
          </TouchableOpacity>
        )}

        {/*Delete Account*/}
        <TouchableOpacity
          style={{ borderWidth: 1, borderRadius: 10, padding: 10, margin: 10 }}
          onPress={() => {
            Alert.alert(
              "Warning!",
              "Are you sure you want to delete your account?",
              [
                {
                  text: "Yes",
                  onPress: () => {
                    this.deleteAccount();
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
          }}
        >
          <Text style={{ color: "black" }}> Delete Blindly Account </Text>
        </TouchableOpacity>

        {/*Logout*/}
        <TouchableOpacity
          style={{ borderWidth: 1, borderRadius: 10, padding: 10, margin: 10 }}
          onPress={() => {
            this.props.navigation.navigate("Login");
          }}
        >
          <Text style={{ color: "black" }}> Sign out </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
