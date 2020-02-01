import React from "react";
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

import { server_profile } from "../../config/ipconfig";

const { height, width } = Dimensions.get("window");

var jwtDecode = require("jwt-decode");

import Footer from "../../sharedComponents/Footer";

import ResetReduxDataAction from "../../storage/actions/RegistrationActions/ResetReduxDataAction";
import SetJwtAction from "../../storage/actions/DataReducerActions/SetJwtAction";

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  deleteAccount = () => {
    console.log("delete Account");
    fetch(`${server_profile}/api/profile/delete`, {
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
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.9, alignItems: "center" }}>
          <ScrollView>
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
                <Text style={{ color: "black" }}>
                  {" "}
                  Sign up a Blindly Account{" "}
                </Text>
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
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                margin: 10
              }}
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
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                margin: 10
              }}
              onPress={() => {
                this.props.SetJwtAction(null);
                this.props.ResetReduxDataAction({
                  reset: true
                });
                this.props.navigation.navigate("Login");
              }}
            >
              <Text style={{ color: "black" }}> Sign out </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/*Footer*/}
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetJwtAction: payload => dispatch(SetJwtAction(payload)),
    ResetReduxDataAction: payload => dispatch(ResetReduxDataAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
