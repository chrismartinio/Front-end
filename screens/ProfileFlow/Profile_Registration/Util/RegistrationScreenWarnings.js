import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  warningText: {
    color: "#6a0dad",
    fontSize: Math.round(width / 37.5),
    paddingTop: "3%",
    fontWeight: "bold"
  }
});

//================================
// createAccount
//================================
export const emptyEmailWarning = (
  <Text style={styles.warningText}>* Please enter a email</Text>
);
export const emptyPasswordWarning = (
  <Text style={styles.warningText}>* Please enter a password</Text>
);

export const invalidEmailWarning = (
  <Text style={styles.warningText}>* Please enter a valid email address</Text>
);

export const duplicateEmailWarning = (
  <Text style={styles.warningText}>* Email has been used.</Text>
);

export const invalidConfirmEmailWarning = (
  <Text style={styles.warningText}>* Email address does not match</Text>
);

export const invalidPasswordWarning = (
  <Text style={styles.warningText}>* Please enter a valid password</Text>
);

export const incorrectPasswordWarning = (
  <Text style={styles.warningText}>* Please enter a correct password</Text>
);

export const invalidConfirmPasswordWarning = (
  <Text style={styles.warningText}>* Password does not match</Text>
);

//================================
// aboutYou
//================================
export const invalidFirstNameWarning = (
  <Text style={styles.warningText}>
    * Please enter a valid first name (letters and spaces)
  </Text>
);
export const invalidLastNameWarning = (
  <Text style={styles.warningText}>
    * Please enter a valid last name (letters and spaces)
  </Text>
);
export const invalidBirthDateWarning = (
  <Text style={styles.warningText}>
    * Please enter a valid birth date (at least 18)
  </Text>
);
export const invalidGenderWarning = (
  <Text style={styles.warningText}>* Please enter a valid gender</Text>
);
export const invalidCountryWarning = (
  <Text style={styles.warningText}>* Please enter a valid gender</Text>
);
export const invalidZipCodeWarning = (
  <Text style={styles.warningText}>* Please enter a valid zip code</Text>
);
//work for first, last, zip, birth
export const emptyWarning = <Text style={styles.warningText}>* Required</Text>;

//================================
// preferences
//================================
export const emptyGenderWarning = (
  <View style={{ alignItems: "center" }}>
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <Icon
        type="font-awesome"
        name="exclamation-circle"
        color="#6a0dad"
        iconStyle={{ top: 3 }}
      />
      <Text style={styles.warningText}>
        {"   "}Please choose at least one gender
      </Text>
    </View>
  </View>
);

//================================
// interests
//================================
export const invalidLikesWarning = (
  <View style={{ alignItems: "center" }}>
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <Icon
        type="font-awesome"
        name="exclamation-circle"
        color="#6a0dad"
        iconStyle={{ top: 3 }}
      />
      <Text style={styles.warningText}>{"   "}Please select 3 interests</Text>
    </View>
  </View>
);

//================================
// localDestination
//================================
export const emptyCityWarning = (
  <View style={{ alignItems: "center" }}>
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <Icon
        type="font-awesome"
        name="exclamation-circle"
        color="#6a0dad"
        iconStyle={{ top: 3 }}
      />
      <Text style={styles.warningText}>{"   "}Please select a city</Text>
    </View>
  </View>
);

//================================
// all screens
//================================
export const internalErrorWarning = (
  <Text style={styles.warningText}>
    * Some error occurred. Please try again!
  </Text>
);
