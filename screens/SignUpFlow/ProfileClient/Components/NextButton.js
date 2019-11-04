import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

//Dimensions
const { height, width } = Dimensions.get("window");

export default function NextButton(props) {
  return (
    <View alignItems="center" style={{ opacity: props.passed ? 1.0 : 0.5 }}>
      {/*  The screen will check if all data filled correctly
        if not filled corectly, passed = false, and !passed = true, that mean disable={true}
        if filled correctly , passed = true, and !passed = false, that mean disable={false} */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={props.handleSubmit}
        disabled={(props.passed && props.isDelaying) || !props.passed}
      >
        {props.passed && props.isDelaying ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.nextButtonText}>Next</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nextButtonText: {
    color: "#fff",
    fontSize: Math.round(width / 18.75)
  },
  nextButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "55%"
  }
});
