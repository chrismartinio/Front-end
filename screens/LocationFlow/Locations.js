import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  FlatList
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import _ from 'lodash';
import LocationsDetailsList from './LocationsDetailsList';
import flagBlueImg from '../../assets/images/blindlySmall.png';
import flagPinkImg from '../../assets/images/blindlySmall.png';

import LoadingScreen from '../../sharedComponents/LoadingScreen';

const fakeLocations = [
  {
    name: 'Olive Garden',
    offer: 'Special deal for 10% off all appetizers and 30% off all entrees',
    distance: '2.4',
    key: '1'
  },
  { name: 'Red Lobster', offer: '', distance: '9.3', key: '2' },
  {
    name: "Chili's",
    offer: 'Special deal for 5% off total bill',
    distance: '4.9',
    key: '3'
  },
  {
    name: "Applebee's",
    offer: 'Special deal for 20% off all entrees',
    distance: '5.1',
    key: '4'
  },
  {
    name: 'Mc Donalds',
    offer: '',
    distance: '2.1',
    key: '5'
  },
  {
    name: 'Chipotle',
    offer: 'Special deal for 10% off all appetizers',
    distance: '9.3',
    key: '6'
  }
];

export default class LocationServices extends Component {
  state = {
    region: {
      latitude: -1,
      longitude: -1,
      latitudeDelta: -1,
      longitudeDelta: -1
    },
    coordinate: {
      latitude: 0,
      longitude: 0
    }
  };

  componentDidMount() {
    this.setRegion();
  }

  setRegion = () => {
    return this.getCurrentLocation().then(position => {
      if (position) {
        this.setState({
          coordinate: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025
          }
        });
      }
    });
  };

  setCurrentLocation = coordinate => {
    const results = coordinate === undefined ? {} : coordinate;
    results === {}
      ? null
      : this.setState({
          coordinate: {
            latitude: results.latitude,
            longitude: results.longitude
          }
        });
  };

  getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        e => reject(e)
      );
    });
  };

  loadingScreen = () => {
    return <LoadingScreen navigation={this.props.navigation} />;
  };

  render() {
    const { coordinate, region } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleHeader} allowFontScaling={false}>
            Blindspots
          </Text>
          <Text style={styles.titleSubHeader} allowFontScaling={false}>
            for you and {'Nicole'}
          </Text>
        </View>
        <MapView
          provider="google"
          style={styles.map}
          showsUserLocation={true}
          initialRegion={region.latitude === -1 ? null : region}
          onUserLocationChange={e =>
            this.setCurrentLocation(e.nativeEvent.coordinate)
          }>
          <TextInput
            value={this.state.destinationInput}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={input => {
              if (parseFloat(input)) {
                this.setState({ distance: input });
                this.getPlacesDebounced(input);
              }
            }}
            style={styles.placeInputStyle}
            placeholder="How many miles?"
          />
          <Marker
            key="user"
            coordinate={coordinate}
            title={'Your location'}
            image={flagBlueImg}
            centerOffset={{ x: 0.5, y: 0 }}></Marker>
        </MapView>
        <View style={styles.listItemsContainer}>
          <LocationsDetailsList data={fakeLocations} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    ...StyleSheet.absoluteFillObject
  },
  titleContainer: {
    paddingTop: 10,
    paddingBottom: 8,
    flex: 0,
    alignItems: 'center'
  },
  titleHeader: {
    color: 'rgb(75, 23, 146)',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 2
  },
  titleSubHeader: {
    padding: 2,
    color: 'rgb(75, 23, 146)',
    fontSize: 18
  },
  placeInputStyle: {
    height: 45,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    padding: 5,
    borderRadius: 5,
    borderStyle: 'solid',
    borderBottomWidth: 0.25,
    borderLeftWidth: 0.25,
    borderTopWidth: 0.25,
    borderRightWidth: 0.25,
    borderBottomColor: 'rgb(211, 211, 211)',
    borderLeftColor: 'rgb(211, 211, 211)',
    borderTopColor: 'rgb(211, 211, 211)',
    borderRightColor: 'rgb(211, 211, 211)',
    backgroundColor: 'white'
  },
  map: {
    flex: 3,
    marginTop: 0
  },
  listItemsContainer: {
    flex: 2,
    paddingTop: 0,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 10
  },
  customView: {
    width: 160
  }
});
