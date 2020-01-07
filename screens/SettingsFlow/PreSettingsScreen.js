import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Button
} from "react-native";

import { connect } from "react-redux";

import { localhost } from "../../config/ipconfig";
import SetDeviceUserImageUrlAction from "../../storage/actions/ImageProcessingActions/SetDeviceUserImageUrlAction/";

class PreSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false
    };
  }

  setProfileImage = async guid => {
    fetch(`http://${localhost}:4000/api/profile/profile_query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        guid: guid,
        collection: "aboutYou"
      })
    })
      .then(res => res.json())
      .then(res => {
        this.props.SetDeviceUserImageUrlAction({
          url: res.result.imageUrl
        });
      })
      .catch(err => {
        console.log(err);
        this.props.SetDeviceUserImageUrlAction({
          url: ""
        });
      });
  };

  async componentDidMount() {
    this.guid = await this.props.CreateProfileDataReducer.guid;

    await this.setProfileImage(this.guid);

    this.props.navigation.navigate("Home");
    this.setState({
      isSuccess: true
    });
  }

  /*
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.isSuccess !== this.state.isSuccess) {
      this.props.navigation.navigate("Home");
    }
  }
*/

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4d88ff",
          justifyContent: "center"
        }}
      >
        {/*Loading Text*/}
        <ActivityIndicator size="large" color="white" />
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "white" }}>Setting Up</Text>
          <Text />
          <Button
            title={"back to login"}
            color={"white"}
            onPress={() => {
              this.props.navigation.navigate("Login");
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetDeviceUserImageUrlAction: payload =>
      dispatch(SetDeviceUserImageUrlAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreSettingsScreen);
