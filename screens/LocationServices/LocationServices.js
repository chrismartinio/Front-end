import React, { Component } from 'react'
import { Text, StyleSheet, View,   TextInput, Dimensions } from 'react-native'
import MapView, {Marker, Callout} from 'react-native-maps';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import _ from 'lodash';
import flagBlueImg from '../../assets/images/blindlySmall.png';
import flagPinkImg from '../../assets/images/blindlySmall.png';

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
          marker2: true,
          OffsetX: Math.random()*82-42,
          OffsetY: Math.random()*120 -60,
          targetLat: 41.6,
          targetLong: -73.11162,
          targetNickName:'Brenda'
        };
        this.getPlacesDebounced = _.debounce(this.setUserCoords,1000);

    }
    //target coords will be offset with "centerOffset" marker
    //callout with more information
    //auto zoom to encompass all pins

    componentDidMount(){
        // const SampleCoords = [{
        //     "latitude": 41.59486,
        //     "longitude": -73.11162,
        //     "title": "Pizza Hut",
        //   },{
        //     "latitude": 41.60325,
        //     "longitude": -73.11645,
        //     "title": "Country Cinema",
        //   },]
        this.setUserCoords()
          //this.showMarkersOnMap(SampleCoords);
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
                      "deviceLatLong": `${this.state.userLatitude},${this.state.userLatitude}`,"deviceRadiusPref": `${this.state.distance*1609.344}`,"deviceLat": `${this.state.userLatitude}`,"deviceLong": `${this.state.userLongitude}`                   })

                        // "deviceLatLong": "41.59486,-73.11162","deviceRadiusPref": "3000","deviceLat": "41.59486","deviceLong": "-73.11162"                   })
                  })
                    .then(res => res.json())
                    .then(res => {
                      // console.log(res.businessLat);//magic happens here
                      // const latLng = {
                      //     latitude: parseFloat(res[0].businessLat),
                      //     longitude: parseFloat(res[0].businessLong),
                      //     title: res[0].businessName
                      // }
                      //console.log(latLng)
                      //this.showMarkersOnMap(latLng);
                      const latLng = res.map(result => ({
                        latitude: parseFloat(result.businessLat),
                        longitude: parseFloat(result.businessLong),
                        id: result._id,
                        title: result.businessName,
                        businessAddress: result.businessAddress,
                        businessCity: result.businessCity,
                        businessState: result.businessState,
                        businessZip: result.businessZip,
                      }));
                      console.log(latLng)
                      this.showMarkersOnMap(latLng)

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
              key={marker.id}
              coordinate={marker}
              title={marker.title+'\n'+marker.businessAddress+'\n'+marker.businessCity+', ' + marker.businessState+' ' + marker.businessZip}
            >
            <Callout style={styles.customView}
                  //tooltip={true}
                  >
                    <View>
                      <Text>{marker.title+'\n'+marker.businessAddress+'\n'+marker.businessCity+', ' + marker.businessState+' ' + marker.businessZip}</Text>
                    </View>
                  </Callout>
            </Marker>
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
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025,
                }}
                >

              <View>
                <TextInput
                    value={this.state.destinationInput}
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={input => {
                      if(parseFloat(input))
                      {
                        this.setState({distance: input})
                        this.getPlacesDebounced(input)

                      }
                  }}
                    style={styles.placeInputStyle}
                    placeholder='How many miles?'
            />

            </View>
                {marker}
                <Marker
                  onPress={() => this.setState({ marker2: !this.state.marker2 })}
                  coordinate={{
                    latitude: this.state.targetLat,
                    longitude: this.state.targetLong,
                  }}
                  title={this.state.targetNickName}
                  centerOffset={{ x: this.state.OffsetX, y: this.state.OffsetY }}
                  // anchor={{ x: 0.84, y: 1 }}
                  image={this.state.marker2 ? flagBlueImg : flagPinkImg}
                  >

                </Marker>

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
 placeInputStyle:{
  height: 40,
  marginTop: 10,
  padding: 5,
  backgroundColor: 'white'

},
customView: {
  width: 160,
},
plainView: {
  width: 60,
},
});
