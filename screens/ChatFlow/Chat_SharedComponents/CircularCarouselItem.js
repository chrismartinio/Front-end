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

import {
  shortTheMessage,
  shortName,
  shortAgeAndAddressSTR,
  calculateLastMessageDate
} from "../Util/ConnectionsScreenFunctions.js";

import {getOnlineStatus} from "../../../screens/ChatFlow/Util/onlinePresence.js"

function calculateAge(birthday) {
  birthday = new Date(birthday);
  // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default class CircularCarouselItem extends React.Component {
  constructor(props) {
    super(props);
  }

  goToPermanentChatRoom = ({
    addressLatitude,
    addressLongitude,
    age,
    birthDate,
    city,
    firstName,
    imageUrl,
    lastMessageDate,
    lastName,
    likesArray,
    roomGuid,
    roomLastMessage,
    state,
    status,
    userGuid,
    zipCode
  }) => {
    let matchObj = {
      matchUserGuid: userGuid,
      matchRoomGuid: roomGuid,
      matchFirstName: firstName,
      matchLastName: lastName,
      matchLikesArray: likesArray,
      matchImageUrl: imageUrl,
      matchMiles: "4.26",
      matchAge: age,
      matchCity: city,
      matchState: state
    };

    this.props.navigation.navigate("PermanentChatRoom", matchObj);
  };

  render() {
    let nameFont = shortName(this.props.matchUserData.firstName);
    getOnlineStatus(this.props.matchUserData.userGuid);
    let ageAddressFont = shortAgeAndAddressSTR(
      this.props.matchUserData.age + " , " + this.props.matchUserData.city
    );
    //Outer box
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
        {/*Inner Box*/}
        <TouchableOpacity
          onPress={() => {
            this.goToPermanentChatRoom(this.props.matchUserData);
          }}
          style={{
            backgroundColor: "#ccccff",
            width: this.props.width - 5,
            height: this.props.height - 5,
            borderRadius: this.props.borderRadius
          }}
        >
          <View
            style={{
              flexDirection: "row",
              overflow: "hidden",
              flexWrap: "nowrap"
            }}
          >
            {/*Image*/}
            <Image
              source={{
                uri: this.props.matchUserData.imageUrl
              }}
              style={{
                width: width * 0.22,
                height: width * 0.22,
                borderRadius: width * 0.108,
                borderWidth: 3,
                right: width * 0.012,
                bottom: width * 0.007,
                borderColor: "#fff"
              }}
            />

            <View
              style={{
                flexDirection: "column",
                overflow: "hidden",
                margin: 5
              }}
            >
              {/*First Row*/}
              <View
                style={{
                  flexDirection: "row",
                  overflow: "hidden",
                  justifyContent: "space-between",
                  width: this.props.width - width * 0.36
                }}
              >
                {/*Name*/}
                <Text
                  style={{
                    fontSize: width * nameFont
                  }}
                >
                  {this.props.matchUserData.firstName}
                  {/*this.props.matchUserData.matchLastName[0]*/}
                </Text>

                {/*Age and Address*/}
                <Text style={{ fontSize: width * 0.038 }}>
                  {this.props.matchUserData.age} ,
                  {this.props.matchUserData.city}
                </Text>
              </View>

              <View style={{ padding: 1 }} />

              <Text style={{ fontSize: width * 0.028, opacity: 0.7 }}>
                "{shortTheMessage(this.props.matchUserData.roomLastMessage)}"
              </Text>

              <View style={{ padding: 2 }} />

              {/*Last Replied Date*/}
              <Text style={{ color: "black", fontSize: 10 }}>
                Last Replied{" "}
                {calculateLastMessageDate(
                  this.props.matchUserData.lastMessageDate
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    backgroundColor: "#fff",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  }
});
