import React, { Component } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground
} from "react-native";

class TellUsMore extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: "flex-end"}}>
        <Text style={styles.header}>TellUsMore</Text>
        {/*<View style={{ padding: "50%" }} />*/}
        <TextInput
          placeholder="Username"
          placeholderTextColor="#fff"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#fff"
          style={styles.input}
        />
        <TextInput
          placeholder="Confrim Password"
          placeholderTextColor="#fff"
          style={styles.input}
        />
        <View style={styles.btnContainer}>
          <Button title="Submit" onPress={() => null} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-end"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  input: {
    height: 40,
    borderColor: "#fff",
    color: "#fff",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  },
  screenTab: {
    //padding: 24,
    flex: 1,
    justifyContent: "flex-start"
  },
  screenTabInner: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 10,
    //borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    width: "110%"
  }
});

export default TellUsMore;
