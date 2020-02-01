import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  Dimensions
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
//Redux
import { connect } from "react-redux";

import { Icon } from "react-native-elements";

const { height, width } = Dimensions.get("window");
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import SetFooterCurrentScreen from "../storage/actions/GlobalReducerActions/SetFooterCurrentScreen/";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDelaying: false
    };
  }

  async componentDidMount() {
    this.setState({ isDelaying: true });
    this.timeout = setTimeout(() => {
      this.setState({ isDelaying: false }, () => {
        this.timeout = null;
      });
    }, 1500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const resetProfileAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "Home" }),
        NavigationActions.navigate({
          routeName: "Profile",
          params: {
            guid: this.props.CreateProfileDataReducer.guid,
            isDeviceUser: true
          }
        })
      ]
    });

    const resetConversationsAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "Home" }),
        NavigationActions.navigate({
          routeName: "Conversations"
        })
      ]
    });

    const resetConnectionsAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "Home" }),
        NavigationActions.navigate({
          routeName: "Connections"
        })
      ]
    });

    const resetMatchingAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "Home" }),
        NavigationActions.navigate({
          routeName: "Matching"
        })
      ]
    });

    const resetSettingAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "Home" }),
        NavigationActions.navigate({
          routeName: "Setting"
        })
      ]
    });

    return (
      <View
        style={{
          flex: 0.13,
          flexDirection: "column",
          justifyContent: "flex-end"
        }}
      >
        <View style={styles.footer}>
          {/*Profile*/}
          <TouchableOpacity
            disabled={this.state.isDelaying}
            onPress={() => {
              this.props.SetFooterCurrentScreen({
                footer_currentScreen: "Profile"
              });
              this.props.navigation.dispatch(resetProfileAction);
            }}
          >
            <FontAwesome
              name={
                this.props.GlobalReducer.footer_currentScreen === "Profile"
                  ? "user-circle"
                  : "user-circle-o"
              }
              style={{ textAlign: "center" }}
              size={width * 0.06}
              color="#4b1792"
            />
            <Text style={styles.footerText}>Profile</Text>
          </TouchableOpacity>

          {/*Conversations*/}
          <TouchableOpacity
            disabled={this.state.isDelaying}
            onPress={() => {
              this.props.SetFooterCurrentScreen({
                footer_currentScreen: "Conversations"
              });
              this.props.navigation.dispatch(resetConversationsAction);
            }}
          >
            <FontAwesome
              name={
                this.props.GlobalReducer.footer_currentScreen ===
                "Conversations"
                  ? "commenting"
                  : "commenting-o"
              }
              style={{ textAlign: "center" }}
              size={width * 0.06}
              color="#4b1792"
            />
            <Text style={styles.footerText}>Conversations</Text>
          </TouchableOpacity>

          {/*Notifications*/}
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Notifications");
            }}
          >
            <Icon
              type="font-awesome"
              size={width * 0.06}
              name="bell-o"
              color="#6a0dad"
            />
            <Text style={styles.footerText}>Notifications</Text>
          </TouchableOpacity>

          {/*Connections*/}
          <TouchableOpacity
            disabled={this.state.isDelaying}
            onPress={() => {
              this.props.SetFooterCurrentScreen({
                footer_currentScreen: "Connections"
              });
              this.props.navigation.dispatch(resetConnectionsAction);
            }}
          >
            <View style={{ bottom: 10 }}>
              <MaterialCommunityIcons
                name={
                  this.props.GlobalReducer.footer_currentScreen ===
                  "Connections"
                    ? "account-supervisor-circle"
                    : "account-supervisor"
                }
                style={{ textAlign: "center" }}
                size={width * 0.08}
                style={{ top: 10, textAlign: "center" }}
                color="#6a0dad"
              />
              <Text style={styles.footerText}>Connections</Text>
            </View>
          </TouchableOpacity>

          {/*Settings*/}
          <TouchableOpacity
            disabled={this.state.isDelaying}
            onPress={() => {
              this.props.SetFooterCurrentScreen({
                footer_currentScreen: "Settings"
              });
              this.props.navigation.dispatch(resetSettingAction);
            }}
          >
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <Icon
                type="font-awesome"
                size={width * 0.06}
                name="sliders"
                color="#6a0dad"
              />
            </View>
            <Text style={styles.footerText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "white",
    //borderTopLeftRadius: 25,
    //borderTopRightRadius: 25,
    borderColor: "#4b1792",
    borderWidth: 0.17,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10
  },
  footerText: {
    color: "#6a0dad",
    fontSize: width * 0.026,
    textAlign: "center",
    marginTop: 5
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {
    SetFooterCurrentScreen: payload => dispatch(SetFooterCurrentScreen(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
