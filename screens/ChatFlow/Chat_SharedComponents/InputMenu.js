import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Keyboard
} from "react-native"; // import all the necessary components

const { height, width } = Dimensions.get("window");

import { shortTheMessage } from "../Util/ConnectionsScreenFunctions.js";

import { Icon } from "react-native-elements";

export default class InputMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between"
          }}
        >
          {/*Attachements*/}
          <TouchableOpacity>
            <Icon
              type="font-awesome"
              name="plus"
              iconStyle={{ top: 10, left: 25 }}
              size={25}
              color="gray"
            />
          </TouchableOpacity>

          {/*Text Input*/}
          <View style={styles.messageInputBox}>
            <TextInput
              style={styles.messageInputStyle}
              onSubmitEditing={Keyboard.dismiss}
              placeholder="Write Something here..."
              onChangeText={this.props.onChangeText}
              keyboardShouldPersistTaps={"handled"}
              value={this.props.currentMessage}
            />
          </View>

          {/*emoji*/}
          <TouchableOpacity>
            <Icon
              type="font-awesome"
              name="smile-o"
              iconStyle={{ top: 10, right: 25 }}
              size={25}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/*Space*/}
        <View style={{ padding: "3%" }} />

        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          {/*Send Button*/}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={this.props.submitMessage}
          >
            <Text style={{ fontSize: width * 0.04 }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sendButton: {
    color: "gray",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    width: width * 0.13,
    height: 25,
    alignItems: "center"
  },
  messageInputBox: {
    flexDirection: "column",
    justifyContent: "flex-end"
  }
});
