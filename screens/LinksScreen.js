import React from "react";
import { ScrollView, StyleSheet, Text, View, Button } from "react-native";
import { ExpoLinksView } from "@expo/samples";

import firebase from "../utils/mainFire";

//NOTE
//linkscreen -> testProfile working
//but linkscreen -> testProfile -> profileLocation not working
//Because profileLocation is set inside the MainNavigator stack,
//And in the MainNavigator, the default screen is Home
//And there is a back button in profileLocation (cuz is stack)
//this back button is pointing to the stack default screen is home
//and home require firstname of device user when they login
//therefore, there will be a error say no firstname since we are not logging when using linkscreen

class LinksScreen extends React.Component {
  static navigationOptions = {
    title: "Testing Screen"
  };
  constructor(props) {
    super(props);

    this.buttonAry = [
      //Location Flow
      "TestLocationServices",

      //Profile Registraiton Flow
      "TestProfile_Registration",
      "TestRegistrationComplete",
      "TestOldSelfie",
      "TestSelfie",

      //Profile Flow
      "TestProfile", //Notification kinda buggy in linksScreen; regular flow (normal) will be not buggy

      //Match Flow
      "TestFoundaMatchScreen",

      //Chat Flow
      "MinuteChatRoom",
      "PermanentChatRoom",

      //sharedComponents
      "TestErrorScreen"

      //"TestPhotoReview",
      //"TestQuestionaries",
      //"TestReplyQuestionaire",
      //"TestViewQuestionaire",
    ];
  }

  render() {
    let displayButton = this.buttonAry.map((e, index = 0) => {
      if (e === "TestProfile") {
        //must turn on profile server for matched user profile
        return (
          <Button
            key={index++}
            title={e}
            onPress={() =>
              this.props.navigation.navigate(e, {
                guid: "5de42a14b4dc5b1fba94e1d3",
                isDeviceUser: false
              })
            }
          />
        );
      }

      if (e === "TestSelfie") {
        return (
          <Button
            key={index++}
            title={e}
            onPress={() =>
              this.props.navigation.navigate(e, {
                isEdit: false //Profile_Registration
                //isEdit: true //EditScreen
              })
            }
          />
        );
      }

      return (
        <Button
          key={index++}
          title={e}
          onPress={() =>
            this.props.navigation.navigate(e, { isDeviceUser: false })
          }
        />
      );
    });
    return <ScrollView style={styles.container}>{displayButton}</ScrollView>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default LinksScreen;
