import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image
} from "react-native";

const { height, width } = Dimensions.get("window");

function Separator() {
  return <View style={styles.separator} />;
}

//MinuteRoom : get matched info from previous screen obj or params
//PermanentRoom: get matchedInfo from guid

export default class NotificationItem extends React.Component {
  constructor(props) {
    super(props);
  }

  replyToMatchedUser = chatRoomData => {
    this.props.navigation.navigate("PermanentChatRoom", chatRoomData);
  };

  render() {
    let { itemData } = this.props;
    return (
      <View
        style={{
          paddingTop: `${width * 0.008}%`,
          paddingBottom: `${width * 0.008}%`
        }}
      >
        {/*Messages Info*/}
        <View style={styles.matchedUserInfoCenterWrap}>
          <View style={styles.matchedUserInfoWrap}>
            <Image
              style={styles.image}
              source={{ uri: itemData.matchedImage }}
            />
            <View style={{ padding: `${width * 0.005}%` }} />
            <View style={{ flexWrap: "wrap" }}>
              <Text style={styles.messagesStatus}>
                {itemData.matchedFirstName} has left you{" "}
                {itemData.matchedTotalUnreadMessages} messages {"\n"}
              </Text>
              <Text style={styles.messagesTime}>
                {itemData.matchedLastRepliedTime}
              </Text>
            </View>
          </View>
        </View>

        {/*Button*/}
        <View style={styles.buttonsWrap}>
          {/*Reply Button*/}
          <View style={styles.buttonWrap}>
            <TouchableOpacity
              onPress={() => {
                this.replyToMatchedUser(itemData);
              }}
              style={[styles.buttonsStyles, { backgroundColor: "#4d0091" }]}
            >
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
          </View>
          {/*Later Button*/}
          <View style={styles.buttonWrap}>
            <TouchableOpacity
              onPress={() => {
                console.log("Later");
              }}
              style={[styles.buttonsStyles, { backgroundColor: "transparent" }]}
            >
              <Text style={styles.laterButtonText}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Separator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  matchedUserInfoCenterWrap: {
    alignItems: "center"
  },
  matchedUserInfoWrap: {
    flexDirection: "row"
  },
  image: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: 25,
    borderColor: "white",
    borderWidth: 1
  },
  messagesStatus: {
    fontSize: width * 0.04
  },
  messagesTime: {
    opacity: 0.7,
    fontSize: width * 0.04
  },

  buttonsWrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: `${width * 0.013}%`,
    marginBottom: `${width * 0.013}%`
  },

  buttonWrap: {
    marginLeft: `${width * 0.013}%`,
    marginRight: `${width * 0.013}%`
  },

  buttonsStyles: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4d0091",
    paddingTop: width * 0.013,
    paddingBottom: width * 0.013,
    paddingLeft: width * 0.12,
    paddingRight: width * 0.12
  },
  replyButtonText: {
    color: "#fff"
  },
  laterButtonText: {
    color: "#4d0091"
  },
  separator: {
    borderBottomColor: "#fff",
    borderBottomWidth: 5
  }
});
