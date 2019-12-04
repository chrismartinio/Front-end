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
          <View style={{ width: 100, height: 75, backgroundColor: "skyblue" }}>
            <Button
              title="Matching"
              onPress={() =>
                this.props.navigation.dispatch(resetMatchingAction)
              }
            />
          </View>
          <View
            style={{
              width: 100,
              height: 75,
              backgroundColor: "powderblue"
            }}
          >
            <Button
              title="Go to Setting"
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
