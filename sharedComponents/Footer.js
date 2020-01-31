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

import SetFooterCurrentScreen from "../storage/actions/GlobalReducerActions/SetFooterCurrentScreen/";

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    console.log(this.props.GlobalReducer.footer_currentScreen);
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
            disabled={
              this.props.GlobalReducer.footer_currentScreen === "Profile"
                ? true
                : false
            }
            onPress={() => {
              this.props.SetFooterCurrentScreen({
                footer_currentScreen: "Profile"
              });
              this.props.navigation.dispatch(resetProfileAction);
            }}
          >
            <Icon name="person" size={width * 0.06} color="#6a0dad" />
            <Text style={styles.footerText}>Profile</Text>
          </TouchableOpacity>

          {/*Conversations*/}
          <TouchableOpacity
            disabled={
              this.props.GlobalReducer.footer_currentScreen === "Conversations"
                ? true
                : false
            }
            onPress={() => {
              this.props.SetFooterCurrentScreen({
                footer_currentScreen: "Conversations"
              });
              this.props.navigation.dispatch(resetConversationsAction);
            }}
          >
            <Icon
              type="font-awesome"
              size={width * 0.06}
              name="commenting-o"
              color="#6a0dad"
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
            disabled={
              this.props.GlobalReducer.footer_currentScreen === "Connections"
                ? true
                : false
            }
            onPress={() => {
              this.props.SetFooterCurrentScreen({
                footer_currentScreen: "Connections"
              });
              this.props.navigation.dispatch(resetConnectionsAction);
            }}
          >
            <Icon name="people" size={width * 0.06} color="#6a0dad" />
            <Text style={styles.footerText}>Connections</Text>
          </TouchableOpacity>

          {/*Settings*/}
          <TouchableOpacity
            disabled={
              this.props.GlobalReducer.footer_currentScreen === "Settings"
                ? true
                : false
            }
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
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
