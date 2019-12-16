import React, { Component } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";

export default class CustomBackButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <Button
            onPress={() => this.props.navigation.navigate("Notification")}
            title="Noti"
            color="black"
          />
        </View>
      </View>
    );
  }
}
