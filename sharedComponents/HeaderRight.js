import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Button
} from "react-native";

export default function headerRight(props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        <Button
          onPress={() => console.log("Editing")}
          title="Edit"
          color="black"
        />
        <Button
          onPress={() => console.log("Notification")}
          title="Noti"
          color="black"
        />
      </View>
    </View>
  );
}
