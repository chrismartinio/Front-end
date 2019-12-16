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
  Dimensions
} from "react-native"; // import all the necessary components

const { height, width } = Dimensions.get("window");

import { shortTheMessage } from "../Util/ConnectionsScreenFunctions.js";

export default class CircularCarouselItem extends React.Component {
  constructor(props) {
    super(props);
  }

  goToPermanentChatRoom = chatRoomData => {
    this.props.navigation.navigate("PermanentChatRoom", chatRoomData);
  };

  render() {
    return (
      <Animated.View
        style={[
          styles.item,
          {
            width: this.props.width,
            height: this.props.height,
            borderRadius: this.props.borderRadius
          },
          this.props.itemAnimationsXY
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            this.goToPermanentChatRoom(this.props.itemData);
          }}
        >
          {/*Box background*/}
          <View
            style={{
              backgroundColor: "#ccccff",
              width: this.props.width - width * 0.008,
              margin: 3,
              height: this.props.height - width * 0.021,
              borderRadius: this.props.borderRadius
            }}
          >
            {/*Box Contents*/}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {/*Image*/}
              <Image
                source={{
                  uri: this.props.itemData.matchedImage
                }}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  borderRadius: 30
                }}
              />

              <View>
                {/*Matched User Info*/}
                <Text style={{ color: "black", fontSize: width * 0.0346 }}>
                  {this.props.itemData.matchedFirstName}
                  {"          "}
                  {this.props.itemData.matchedAge} ,
                  {this.props.itemData.matchedLocation}
                </Text>

                {/*spaces */}
                <View style={{ padding: "2%" }} />

                {/*Last Message*/}
                <Text style={{ color: "black", opacity: 0.5, fontSize: 12 }}>
                  {shortTheMessage(this.props.itemData.matchedLastMessage)}
                </Text>

                {/*spaces */}
                <View style={{ padding: "2%" }} />

                {/*Last Replied Date*/}
                <Text style={{ color: "black", fontSize: 10 }}>
                  Last Replied {this.props.itemData.matchedLastRepliedDate}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    position: "absolute"
  }
});
