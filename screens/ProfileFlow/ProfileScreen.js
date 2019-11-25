import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Button,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import Constants from "expo-constants";

// or any pure javascript modules available in npm
import { Card } from "react-native-paper";

//every time user navigate to profile screen
//it will hit the db

export default class Profile extends React.Component {
  state = {
    userName: "Alex Wagner",
    age: "27",
    city: "San Francsico",
    state: "CA",
    userImage: "https://facebook.github.io/react-native/img/tiny_logo.png",
    likesArray: ["cycling", "film", "photography"],
    bio:
      "Grew up in Portland, Oregion area. Survived middle school by becoming a skatar kid (still havne't grown out of it) Now I'm trying to pay my rent, play my msuic and maek my way. I'm into photography. so I like to snap pictures with either my phone or my camera whenever I find inspiration.",
    photosArray: [
      "https://facebook.github.io/react-native/img/tiny_logo.png",
      "https://facebook.github.io/react-native/img/tiny_logo.png",
      "https://facebook.github.io/react-native/img/tiny_logo.png",
      "https://facebook.github.io/react-native/img/tiny_logo.png",
      "https://facebook.github.io/react-native/img/tiny_logo.png",
      "https://facebook.github.io/react-native/img/tiny_logo.png"
    ]
  };

  render() {
    let displaylikesArray = this.state.likesArray.map((e, index = 0) => {
      return (
        <View key={index++}>
          <TouchableOpacity style={styles.likeButtonWrap}>
            <Text style={styles.likeButton}>#{e}</Text>
          </TouchableOpacity>
        </View>
      );
    });

    let displayphotosArray = this.state.photosArray.map((e, index = 0) => {
      return (
        <TouchableOpacity key={index++}>
          <Image
            source={{
              uri: e
            }}
            style={{ width: 100, height: 75, borderRadius: 15, margin: 3 }}
          />
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.container}>
        <View style={{ margin: 10 }}>
          <Text
            style={{
              color: "black",
              fontSize: 15,
              fontWeight: "500",
              alignSelf: "center"
            }}
          >
            My Profile
          </Text>
        </View>
        <ScrollView>
          <View style={{ alignItems: "center" }}>
            {/**User Image */}
            <ImageBackground
              source={{
                uri: this.state.userImage
              }}
              style={{ width: 350, height: 350, borderRadius: 50 }}
            >
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={{
                    paddingLeft: 50,
                    paddingRight: 50,
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: "purple",
                    borderRadius: 50
                  }}
                >
                  <Text style={{ color: "white" }}>Edit</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

          {/**User Name */}
          <View style={{ margin: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>
              {this.state.userName}, {this.state.age}
            </Text>
            <Text />
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {this.state.city}, {this.state.state}
            </Text>
          </View>

          {/**border line */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
          />

          {/**Interest */}
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              marginTop: 20,
              marginBottom: 3
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Interests</Text>
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>{displaylikesArray}</View>
          </View>
          <View style={{ padding: 7.5 }} />

          {/**border line */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
          />

          {/**About Me */}
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              marginTop: 20,
              marginBottom: 3
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "500" }}>About Me</Text>
          </View>
          <View style={{ margin: 15 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "100",
                textAlign: "left",
                lineHeight: 30
              }}
            >
              {this.state.bio}
            </Text>
          </View>

          {/**border line */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d6d7da"
            }}
          />

          {/**Photo */}
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              marginTop: 20,
              marginBottom: 3
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "500" }}>Photo</Text>
          </View>
          <View
            style={{
              margin: 20
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap"
              }}
            >
              {displayphotosArray}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "white",
    padding: 8
  },
  likeButtonWrap: {
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7.5,
    paddingBottom: 7.5,
    width: "auto",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgb(67, 33, 140)",
    margin: 5
  },
  likeButton: {
    color: "rgb(67, 33, 140)",
    fontSize: 17
  }
});
