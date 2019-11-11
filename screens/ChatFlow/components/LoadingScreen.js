import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StyleSheet
} from "react-native";
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
      <ImageBackground
        source={require("../../../assets/Assets_V1/Butterfly_Background/butterflyBackground.png")}
        style={styles.backgroundImage}
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    width: "100%",
    flex: 1
  }
});
