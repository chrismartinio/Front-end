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
      <View style={{ margin: "1%" }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between"
          }}
        >
          {/*Attachements*/}
          <View style={{ flexDirection: "row", paddingLeft: "5%" }}>
            <View style={{ paddingRight: "5%" }}>
              <TouchableOpacity
                onPress={() => {
                  console.log("ATTACHMENTS");
                }}
              >
                <Icon type="font-awesome" name="plus" size={25} color="gray" />
              </TouchableOpacity>
            </View>

            {/*Text Input*/}
            <View style={styles.messageInputBox}>
              <TextInput
                style={styles.messageInputStyle}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="Write Something here..."
                multiline={true}
                onChangeText={this.props.onChangeText}
                value={this.props.currentMessage}
              />
            </View>
          </View>

          {/*emoji*/}
          <View style={{ paddingRight: "5%", paddingLeft: "5%" }}>
            <TouchableOpacity
              onPress={() => {
                console.log("EMOJI");
              }}
            >
              <Icon type="font-awesome" name="smile-o" size={25} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        {/*Space*/}
        <View style={{ padding: "1%" }} />

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
    width: width * 0.65
  }
});
