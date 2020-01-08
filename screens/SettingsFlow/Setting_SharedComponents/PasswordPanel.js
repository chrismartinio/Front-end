import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
const { height, width } = Dimensions.get("window");

//Icons
import { Icon, Input } from "react-native-elements";

class PasswordPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        {/*old Password*/}
        <View>
          <Input
            placeholder="Old Password"
            placeholderTextColor="rgb(67, 33, 140)"
            inputStyle={styles.inputStyle}
            value={this.props.oldPassword}
            returnKeyType="done"
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={oldPassword => {
              this.props.setPassword(oldPassword, 1);
            }}
          />
        </View>

        {/*new Password*/}
        <View>
          <Input
            placeholder="New Password"
            placeholderTextColor="rgb(67, 33, 140)"
            inputStyle={styles.inputStyle}
            value={this.props.newPassword}
            returnKeyType="done"
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={newPassword => {
              this.props.setPassword(newPassword, 2);
            }}
          />
        </View>

        {/*new Password*/}
        <View>
          <Input
            placeholder="Conform New Password"
            placeholderTextColor="rgb(67, 33, 140)"
            inputStyle={styles.inputStyle}
            value={this.props.confirmNewPassword}
            returnKeyType="done"
            autoCompleteType={"off"}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={confirmNewPassword => {
              this.props.setPassword(confirmNewPassword, 3);
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            margin: 5
          }}
          onPress={() => {
            this.props.changePassword();
          }}
        >
          <Text>Change</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    color: "rgb(67, 33, 140)",
    fontSize: Math.round(width / 28.84)
  },
  inputContainer: {
    borderColor: "black",
    borderWidth: 1,
    width: "80%",
    padding: 20,
    borderRadius: 10
  }
});

export default PasswordPanel;
