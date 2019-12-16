import React, { Component } from "react";
import { Text, View, TouchableOpacity, Button } from "react-native";
import { Chevron } from "react-native-shapes";

export default class CustomBackButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ left: "15%", top: "5%" }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Chevron size={1.5} rotate={90} color={this.props.buttonColor} />

            <View style={{ padding: "3%" }} />

            <View style={{ bottom: "13%" }}>
              <Text style={{ color: this.props.buttonColor }}>Back</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
