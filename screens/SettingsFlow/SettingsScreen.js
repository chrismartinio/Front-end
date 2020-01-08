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
  Modal
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
    //delete both blindly and 3rd
    this.toggleMenu(false);
  };

  togglePasswordPanel = () => {
    this.setState({
      passwordPanelVisible: !this.state.passwordPanelVisible
    });
  };

  changePassword = () => {
    //old password
    //new password
    //confirm new password
    console.log("change password")
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
            this.setState({
              modalVisible: true
            });
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

        {/*Delete Account Prompt*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View
            style={{
              position: "absolute",
              height: width * 0.4,
              width: width * 0.53,
              top: "40%",
              alignSelf: "center",
              backgroundColor: "#3399ff",
              borderRadius: 30
            }}
          >
            <View>
              <View style={{ padding: "10%" }} />
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: width * 0.032 }}>
                  Are you sure you want to delete your account?
                </Text>

                <View style={{ padding: "5%" }} />

                <View
                  style={{
                    flexDirection: "row"
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      padding: "3%",
                      borderRadius: 50
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.deleteAccount();
                      }}
                    >
                      <Text style={{ color: "#3399ff" }}>Yes</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ padding: "5%" }} />

                  <View
                    style={{
                      backgroundColor: "#fff",
                      padding: "3%",
                      borderRadius: 50
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.toggleMenu(false);
                      }}
                    >
                      <Text style={{ color: "#3399ff" }}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
