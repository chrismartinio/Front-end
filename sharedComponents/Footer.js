import React, { Component } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
//Redux
import { connect } from "react-redux";

class Footer extends React.Component {
  constructor(props) {
    super(props);
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
          flex: 0.1,
          flexDirection: "column",
          justifyContent: "flex-end"
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {/*User Profile*/}
          <View
            style={{
              width: 100,
              height: 75,
              backgroundColor: "powderblue"
            }}
          >
            <Button
              title="Go to Profile"
              onPress={() => this.props.navigation.dispatch(resetProfileAction)}
            />
          </View>

          {/*Conversations*/}
          <View
            style={{ width: 100, height: 75, backgroundColor: "lightblue" }}
          >
            <Button
              title="Conversations"
              onPress={() =>
                this.props.navigation.dispatch(resetConversationsAction)
              }
            />
          </View>

          {/*Notification*/}
          <View
            style={{ width: 100, height: 75, backgroundColor: "lightyellow" }}
          >
            <Button
              title="Notifications"
              onPress={() => this.props.navigation.navigate("Notification")}
            />
          </View>

          {/*Matching*/}
          <View style={{ width: 100, height: 75, backgroundColor: "skyblue" }}>
            <Button
              title="Connections"
              onPress={() => this.props.navigation.navigate("Connections")}
            />
          </View>

          {/*Setting*/}
          <View
            style={{
              width: 100,
              height: 75,
              backgroundColor: "powderblue"
            }}
          >
            <Button
              title="Setting"
              onPress={() => this.props.navigation.dispatch(resetSettingAction)}
            />
          </View>
        </View>
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
)(Footer);
