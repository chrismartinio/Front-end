import React, { Component } from "react";
import { Text, View, TouchableOpacity, Button, StyleSheet } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
//Redux
import { connect } from "react-redux";

import { Icon } from "react-native-elements";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileToggle: false,
      ConversationsToggle: false,
      NotificationsToggle: false,
      ConnectionsToggle: false,
      SettingsToggle: false
    };
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
          <TouchableOpacity
            onPress={() => this.props.navigation.dispatch(resetProfileAction)}
          >
            <Icon name="person" color="#46278c" />
            <Text style={styles.footerText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.dispatch(resetConversationsAction)
            }
          >
            <Icon type="font-awesome" name="commenting-o" color="#46278c" />
            <Text style={styles.footerText}>Conversations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Notifications")}
          >
            <Icon type="font-awesome" name="bell-o" color="#46278c" />
            <Text style={styles.footerText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Connections")}
          >
            <Icon name="people" color="#46278c" />
            <Text style={styles.footerText}>Connections</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.dispatch(resetSettingAction)}
          >
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <Icon type="font-awesome" name="sliders" color="#46278c" />
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
    color: "#46278c",
    fontSize: 10,
    textAlign: "center",
    marginTop: 5
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
