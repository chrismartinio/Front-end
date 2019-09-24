import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
const styles = StyleSheet.create({
  imageStyles: {
    //justifyContent: 'space-around'
  }
});
var {height, width}= Dimensions.get('window')
export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };



  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    console.log(this.camera)
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality:1,
        base64:false,
        exif:false,
        onPictureSaved: this.handlePicture,

      });

      console.log(photo)
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.9,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={this.snap}
                >

                <Text
                  style={{ fontSize: 18, marginBottom: 0, color: 'white' ,right:15}}>
                  <Image
      source={{ uri: 'https://cdn.pixabay.com/photo/2017/09/28/08/58/camera-2794769_960_720.png' }}
      style={styles.imageStyles}
      height={36}
      width={48}
      borderRadius={0}
    />
                  {/* {' '}Snap{' '} */}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
