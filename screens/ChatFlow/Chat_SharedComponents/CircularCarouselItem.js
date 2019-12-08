import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Animated,
  Image,
  TouchableOpacity
} from "react-native"; // import all the necessary components

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
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              backgroundColor: "lightblue",
              width: this.props.width - 3,
              margin: 3,
              borderRadius: this.props.borderRadius
            }}
          >
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Image
                source={{
                  uri: this.props.itemData.matchedImage
                }}
                style={{ width: 75, height: 75, borderRadius: 30 }}
              />
              <View style={{ padding: 5 }} />
              <View
                style={{
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "black" }}>
                  {this.props.itemData.matchedFirstName}{" "}
                  {this.props.itemData.matchedAge} ,
                  {this.props.itemData.matchedLocation}
                </Text>
                <Text style={{ color: "black", opacity: 0.5 }}>
                  {this.props.itemData.matchedLastMessage}
                </Text>
                <Text style={{ color: "black" }}>
                  Last replied {this.props.itemData.matchedLastReplied}
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
