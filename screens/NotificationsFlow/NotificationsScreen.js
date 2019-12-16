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

import { testobj } from "../../data/testObj";

//MinuteRoom : get matched info from previous screen obj or params
//PermanentRoom: get matchedInfo from guid

const testObj = [
  testobj[0],
  testobj[1],
  testobj[2],
  testobj[3],
  testobj[4],
  testobj[5],
  testobj[6]
];

export default class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationMessageItemsArray: testObj
    };
    //setup socket so they can receive messages immedately
  }

  componetDidMount() {
    //No componentDidMouhnt
    //use redux to store the notificationArray
    //and also a socket that when there is user send data to device's user
    //add to redux
  }

  render() {
    let displayNotificationArray = this.state.notificationMessageItemsArray.map(
      (e, i) => {
        return (
          <NotificationItem
            key={i}
            itemData={e}
            navigation={this.props.navigation}
          />
        );
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
