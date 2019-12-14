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
import { Card } from "react-native-paper";

const { height, width } = Dimensions.get("window");

import NotificationItem from "./NotificationItem";

function Separator() {
  return <View style={styles.separator} />;
}

//MinuteRoom : get matched info from previous screen obj or params
//PermanentRoom: get matchedInfo from guid

const testobj = [
  {
    matchedFirstName: "Aaa 1",
    matchedGuid: "5de42a14b4dc5b1fba94e1d3",
    matchedPermanentRoomID: "someRoomNumber",
    matchedLastRepliedTime: "Some Date",
    matchedTotalUnreadMessages: 0,
    matchedImage:
      "https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg"
  },
  {
    matchedFirstName: "Demetus 3",
    matchedGuid: "5de4b4ec6f3077a0d5252ddd",
    matchedPermanentRoomID: "someRoomNumber",
    matchedLastRepliedTime: "Some Date",
    matchedTotalUnreadMessages: 0,
    matchedImage:
      "http://shared.frenys.com/assets/1009731/6151100-Young-Harrison-Ford.jpg"
  },
  {
    matchedFirstName: "Mike 4",
    matchedGuid: "5de4b6a26f3077a0d5252dde",
    matchedPermanentRoomID: "someRoomNumber",
    matchedLastRepliedTime: "Some Date",
    matchedTotalUnreadMessages: 0,
    matchedImage: "https://www.famousbirthdays.com/faces/efron-zac-image.jpg"
  },
  {
    matchedFirstName: "Qiuwen 5",
    matchedGuid: "5de6e7a326e5604c8552d774",
    matchedPermanentRoomID: "someRoomNumber",
    matchedLastRepliedTime: "Some Date",
    matchedTotalUnreadMessages: 0,
    matchedImage:
      "https://resizing.flixster.com/zYHoIjM-IBcqyt8S3ZJzudd9E24=/fit-in/1152x864/v1.cjszOTU0NDtqOzE4MDAwOzEyMDA7MzkyOzYwMA"
  },
  {
    matchedFirstName: "Kevin 6",
    matchedGuid: "5de7a9a888fab05ca501ae9a",
    matchedPermanentRoomID: "someRoomNumber",
    matchedLastRepliedTime: "Some Date",
    matchedTotalUnreadMessages: 0,
    matchedImage:
      "https://media.gq.com/photos/56d4902a9acdcf20275ef34c/master/w_806,h_1173,c_limit/tom-hardy-lead-840.jpg"
  }
];

export default class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationMessageItemsArray: testobj
    };
    //setup socket so they can receive messages immedately
  }

  componetDidMount() {
    //?
  }

  render() {
    let displayNotificationArray = this.state.notificationMessageItemsArray.map(
      (e, i) => {
        return <NotificationItem key={i} matchedUserInfo={e} />;
      }
    );

    return (
      <View style={styles.container}>
        {/*Box*/}
        <Card style={styles.card}>
          {/*Titles*/}
          <View style={styles.titleWrap}>
            <View>
              <Text style={styles.title}>Notifications</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Text style={styles.clearButton}>All Clear</Text>
            </TouchableOpacity>
          </View>

          {/*Border Line*/}
          <Separator />

          <ScrollView>
            {displayNotificationArray}
            <View style={{ padding: "5%" }} />
          </ScrollView>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080"
  },
  card: {
    backgroundColor: "#e2dcff",
    borderColor: "white",
    borderRadius: 10,
    borderWidth: 6,
    width: width * 0.86,
    height: width * 0.86,
    overflow: "hidden"
  },
  titleWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    color: "black",
    fontSize: width * 0.053,
    fontWeight: "bold",
    fontFamily: "HelveticaNeue-Thin"
  },
  clearButton: {
    color: "black",
    fontWeight: "normal",
    fontSize: width * 0.034,
    top: 7
  },
  separator: {
    borderBottomColor: "#fff",
    borderBottomWidth: 5
  }
});
