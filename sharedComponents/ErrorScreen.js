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
//background color
import { LinearGradient } from "expo-linear-gradient";
import Footer from "./Footer";

class ErrorScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <ImageBackground
          source={require("../assets/Assets_V1/Butterfly_Background/butterflyBackground.png")}
          style={styles.backgroundImage}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 48 }}> (X.X) </Text>
            <Text style={{ fontSize: 16 }}>There is some problem.</Text>
            <Text />
            <Button
              title={"back to login"}
              color={"black"}
              onPress={() => {
                this.props.navigation.navigate("Login");
              }}
            />
          </View>
        </ImageBackground>
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

export default ErrorScreen;
