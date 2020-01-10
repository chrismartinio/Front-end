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

//log out
//sign up blindly account (3rd party)
//delete account
//change password

import { connect } from "react-redux";

import { localhost } from "../../config/ipconfig";

const { height, width } = Dimensions.get("window");

import PasswordPanel from "./Setting_SharedComponents/PasswordPanel";

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      passwordPanelVisible: false,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    };
  }

  componentDidMount() {}

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

    this.toggleMenu(false);
  };

  togglePasswordPanel = () => {
    this.setState({
      passwordPanelVisible: !this.state.passwordPanelVisible
    });
  };

  changePassword = () => {
    if (
      this.state.oldPassword === "" ||
      this.state.newPassword === "" ||
      this.state.confirmNewPassword === ""
    ) {
      return alert("Please fill all the password fields!");
    }

    if (this.state.newPassword !== this.state.confirmNewPassword) {
      return alert("Your password and confirm password are not match!");
    }

    console.log("change password");
    fetch(`http://${localhost}:4000/api/profile/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: this.props.CreateProfileDataReducer.guid,
        collection: "createAccount",
        data: {
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword
        }
      })
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success && res.status === 422) {
          alert("Your old password is incorrect");
        }

        if (!res.success && res.status === 500) {
          throw new Error("Internal Error ");
        }

        if (res.success) {
          Alert.alert(
            "Success!",
            "Your password has changed.",
            [
              {
                text: "OK",
                onPress: () => {}
              }
            ],
            { cancelable: false }
          );
          this.setState({
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
          });
        } else {
          throw new Error("Internal Error ");
        }
      })
      .catch(err => {
        alert("Ops! Some error occured. Please try again!");
      });
  };

  toggleMenu = visible => {
    this.setState({ modalVisible: visible });
  };

  setPassword = (password, type) => {
    //1 - old
    //2 - new
    //3 - confirm new
    switch (type) {
      case 1:
        return this.setState({ oldPassword: password });
      case 2:
        return this.setState({ newPassword: password });
      case 3:
        return this.setState({ confirmNewPassword: password });
      default:
        return;
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        {/*Sign up Blindly Account*/}
        {this.props.CreateProfileDataReducer.isThirdPartiesServiceUser && (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              margin: 10
            }}
            onPress={() => {}}
          >
            <Text style={{ color: "black" }}> Sign up a Blindly Account </Text>
          </TouchableOpacity>
        )}

        {/*Chnage Password*/}
        <TouchableOpacity
          style={{ borderWidth: 1, borderRadius: 10, padding: 10, margin: 10 }}
          onPress={() => {
            this.togglePasswordPanel();
          }}
        >
          <Text style={{ color: "black" }}> Change my password </Text>
        </TouchableOpacity>

        {/*Password Panel*/}
        {this.state.passwordPanelVisible && (
          <PasswordPanel
            oldPassword={this.state.oldPassword}
            newPassword={this.state.newPassword}
            confirmNewPassword={this.state.confirmNewPassword}
            setPassword={this.setPassword}
            changePassword={this.changePassword}
          />
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
