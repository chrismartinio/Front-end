import React, { Component } from "react";
import { Text, StyleSheet, View, TextInput, Dimensions } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

export default class LocationServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLatitude: 0,
      userLongitude: 0
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    let userLatitude = parseInt(navigation.getParam("addressLatitude"));
    let userLongitude = parseInt(navigation.getParam("addressLongitude"));

    this.setState({
      userLatitude: userLatitude,
      userLongitude: userLongitude
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          showsUserLocation
          style={styles.map}
          region={{
            latitude: this.state.userLatitude,
            longitude: this.state.userLongitude,
            latitudeDelta: 15,
            longitudeDelta: 15
          }}
        />
      </View>
    );
  }
}

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: height,
    width: width,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  placeInputStyle: {
    height: 40,
    marginTop: 10,
    padding: 5,
    backgroundColor: "white"
  },
  customView: {
    width: 160
  },
  plainView: {
    width: 60
  }
});
