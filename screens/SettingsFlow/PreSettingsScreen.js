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

import { server_profile } from "../../config/ipconfig";
import SetDeviceUserImageUrlAction from "../../storage/actions/ImageProcessingActions/SetDeviceUserImageUrlAction/";
import SetTimeAction from "../../storage/actions/ConfigReducerActions/SetTimeAction/";
import { StackActions, NavigationActions } from "react-navigation";
import ErrorScreen from "../../sharedComponents/ErrorScreen";

function fetchRetry(url, delay, limit, fetchOptions = {}) {
  return new Promise((resolve, reject) => {
    function success(res) {
      resolve(res);
    }
    function failure(error) {
      limit--;
      if (limit) {
        setTimeout(fetchUrl, delay);
      } else {
        // this time it failed for real
        reject(error);
      }
    }
    function finalHandler(finalError) {
      throw finalError;
    }
    function fetchUrl() {
      return fetch(url, fetchOptions)
        .then(success)
        .catch(failure)
        .catch(finalHandler);
    }
    fetchUrl();
  });
}

class PreSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImagePass: false,
      isSuccess: true
    };
    this.retryTime = 10;
    this.retryDelay = 3000;
  }

  setProfileImage = async guid => {
    await fetch(`${server_profile}/api/profile/profile_query`, {
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
        this.setState({
          profileImagePass: true
        });
      })
      .catch(err => {
        this.props.SetDeviceUserImageUrlAction({
          url: ""
        });
        this.setState({
          profileImagePass: true
        });
      });

    /*
    fetchRetry(
      `http://${localhost}:4000/api/profile/profile_query`,
      this.retryDelay,
      this.retryTime,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guid: guid,
          collection: "aboutYou"
        })
      }
    )
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          throw new Error("failed!");
        }
        return res;
      })
      .then(res => {
        this.props.SetDeviceUserImageUrlAction({
          url: res.result.imageUrl
        });
        this.setState({
          profileImagePass: true
        });
      })
      .catch(err => {
        this.setState({
          isSuccess: false
        });
      });
      */
  };

  async componentDidMount() {
    //Setup GUID
    this.guid = await this.props.CreateProfileDataReducer.guid;

    //Setup Profile Image
    await this.setProfileImage(this.guid);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.profileImagePass !== this.state.profileImagePass) {
      if (this.state.profileImagePass) {
        this.props.navigation.navigate("Home");
      } else {
        this.props.navigation.navigate("Home");
      }
    }
  }

  loadingScreen = () => {
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
  };

  errorScreen = () => {
    return <ErrorScreen navigation={this.props.navigation} />;
  };

  render() {
    return this.state.isSuccess ? this.loadingScreen() : this.errorScreen();
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
      dispatch(SetDeviceUserImageUrlAction(payload)),
    SetTimeAction: payload => dispatch(SetTimeAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreSettingsScreen);
