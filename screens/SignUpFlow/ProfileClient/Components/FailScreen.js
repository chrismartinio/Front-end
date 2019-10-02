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
        <Text style={{ color: "#fff", fontSize: 15 }}>
          Fail to retrieve your data.
        </Text>
        <Text style={{ color: "#fff", fontSize: 15 }}>Please try again!</Text>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
          }}
        />
        <TouchableOpacity onPress={props.getDataFunction}>
          <Text style={{ color: "#fff", fontSize: 15 }}>get Data</Text>
        </TouchableOpacity>
        {/*Spaces*/}
        <View
          style={{
            padding: "3%"
          }}
        />
        <TouchableOpacity onPress={props.startwithEmpty}>
          <Text style={{ color: "#fff", fontSize: 15 }}>start with Empty</Text>
        </TouchableOpacity>
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
