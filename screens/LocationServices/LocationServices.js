import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions } from 'react-native'
import MapView, {Marker} from 'react-native-maps'; 
// import Slider  from 'react-native-slider';

export default class LocationServices extends Component {
    constructor (props) {
        super (props);
        this.state = {
          userLatitude: 0,
          userLongitude:0,
          hasMapPermission: false,
          destinationCoords: [],
          results:[],
          latLng:[],
          distance:1,
        };

    }
    
    componentDidMount(){
        const SampleCoords = [{
            "latitude": 37.7853512,
            "longitude": -122.4329787,
            "title": "DOSA on Fillmore",
          },{
            "latitude": 37.78834750000001,
            "longitude": -122.4335169,
            "title": "Harry's Bar",
          },]
        this.showMarkersOnMap(SampleCoords);
        this.setUserCoords()
      }
    async setUserCoords()
      {
          ///to see the markers properly, set your simulator location to 37.78825, -122.4324,
        navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("----------");
              //console.log(position);
              this.setState({
                userLatitude: position.coords.latitude,
                userLongitude: position.coords.longitude,
                error: null,
              },()=>{
                fetch("http://192.168.1.67:4060/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "deviceLatLong": "41.59486,-73.11162","deviceRadiusPref": "3000","deviceLat": "41.59486","deviceLong": "-73.11162"                    })
                  })
                    .then(res => res.json())
                    .then(res => {
                      console.log(res.businessLat);
                    });
              });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
          );
        // this.setState({
        //         userLatitude:userLatitude,
        //         userLongitude:userLongitude
        //     })
      }
    async showMarkersOnMap(results)
    {
        this.setState({latLng:results})
    }
    render() {
        let marker = null;
        if(this.state.latLng.length>0)
        {
          marker=this.state.latLng.map(marker => (
            <Marker 
              key={marker.longitude+marker.latitude}
              coordinate={marker}
              title={marker.title}
            />
          ))
        }
        return (
            <View style={styles.container}>
                
                <MapView
                //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                showsUserLocation
                followsUserLocation
                style={styles.map}
                region={{
                    latitude: this.state.userLatitude,
                    longitude: this.state.userLongitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                >
                {marker}
                {/* <Marker 
                coordinate={{latitude:this.state.userLatitude, longitude:this.state.userLongitude}}
                title={"YOU ARE HERE"}
                    />   */}
                </MapView>
            </View>
        )
    }
}

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   height: height,
   width: width,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});
