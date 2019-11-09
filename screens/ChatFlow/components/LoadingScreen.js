import React, { Component } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
//background color
import { LinearGradient } from "expo-linear-gradient";

export default function LoadingScreen(props) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {/*Spaces*/}
      <View
        style={{
          padding: "20%"
          //borderRadius: 4,
          //borderWidth: 0.5,
          //borderColor: "#d6d7da"
        }}
      />
      {/*Loading Text*/}
      <View alignItems="center">
        <ActivityIndicator size="large" color="black" />
      </View>
      {/*Spaces*/}
      <View
        style={{
          padding: "20%"
          //borderRadius: 4,
          //borderWidth: 0.5,
          //borderColor: "#d6d7da"
        }}
      />
    </View>
  );
}
