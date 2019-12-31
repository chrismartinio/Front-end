import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
//background color
import { LinearGradient } from "expo-linear-gradient";

export default function FailScreen(props) {
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
        }}
      />
      {/*Loading Text*/}
      <View alignItems="center">
        <Text style={{ color: "rgb(67, 33, 140)", fontSize: 15 }}>
          Fail to retrieve your data.
        </Text>
        <Text style={{ color: "rgb(67, 33, 140)", fontSize: 15 }}>Please try again!</Text>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
          }}
        />
        <TouchableOpacity onPress={props.getDataFunction}>
          <Text style={{ color: "rgb(67, 33, 140)", fontSize: 15 }}>Retry</Text>
        </TouchableOpacity>
        {/*Spaces*/}
        <View
          style={{
            padding: "7%"
          }}
        />
        {/*props.reset && (
          <TouchableOpacity onPress={props.reset}>
            <Text style={{ color: "rgb(67, 33, 140)", fontSize: 15 }}>Reset data</Text>
          </TouchableOpacity>
        )*/}
      </View>
      {/*Spaces*/}
      <View
        style={{
          padding: "20%"
        }}
      />
    </View>
  );
}
