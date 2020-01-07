import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Button
} from "react-native";

class PreSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4d88ff",
          justifyContent: "center"
        }}
      >
        {/*Loading Text*/}
        <ActivityIndicator size="large" color="white" />
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "white" }}>Setting Up</Text>
          <Text />
          <Button
            title={"back to login"}
            color={"white"}
            onPress={() => {
              this.props.navigation.navigate("Login");
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  }
});

export default PreSettingsScreen;
