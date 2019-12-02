import React, { Component } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";

export default class NotificationScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#00000080"
        }}
      >
        <View
          style={{
            flex: 0,
            justifyContent: "center",
            alignItems: "center",
            width: 300,
            height: 300,
            backgroundColor: "lightblue"
          }}
        >
          <Button
            title="All Clear"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text>Notifications</Text>
        </View>
      </View>
    );
  }
}
