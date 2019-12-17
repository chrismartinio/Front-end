import React from 'react';
import { Text, View, Image, TouchableOpacity, TouchableHighlight,Dimensions, StyleSheet } from 'react-native';
import { Camera, Permissions } from 'expo';

import {connect}             from 'react-redux';
import * as uploadImgActions from '../../../storage/actions/uploadMediaActions.js';

import ActionBar from './cameraComponents/ActionsBar.js';
import Action from './cameraComponents/Action.js';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

class Cam extends React.Component {
  state =
    {
      camPermission: null,
      type: Camera.Constants.Type.back
    }

    componentDidMount = async () => {
        const camera         = await Permissions.askAsync(Permissions.CAMERA);
        const camPermission = (camera.status === 'granted');

        this.setState ({ camPermission });
    }

    takePicture = async () => {
      let photoObj;

      if (this.camera) {
        let photo = await this.camera.takePictureAsync ();
        photoObj = {node: {image: {uri: photo.uri}}};
        this.props.addImageToSend (photoObj);
        this.props.toggleCamera ();
        this.props.toggleImages ();
      }

    }

    flipCamera = () => {
      console.log ('FLIP')
      let camType = Camera.Constants.Type;

      this.setState (
        {
          type: this.state.type === camType.back ? camType.front : camType.back 
        })
    }

    render = () => {
      const {camPermission} = this.state;
      
      if (camPermission === null) {
        return (<View><Text>No</Text></View>)
      } else if (!camPermission) {
        return (<Text>Access to camera not granted</Text>)
      } else if (camPermission) {
        return (<View style={{flex: 1}}>
                  
                  <Camera style={styles.camera} type={this.state.type} ref={ref => this.camera = ref} />
                  <View style={{margin: 10}}>
                    <TouchableOpacity style={{flex: 1, position: 'absolute'}}>
                      <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }} onPress={this.props.toggleCamera}>
                        Back
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{margin: 10, top: winHeight - 150}}>
                    <TouchableOpacity style={{flex: 1, position: 'absolute'}} onPress={this.takePicture}>
                      <Image source={{ uri: 'https://cdn.pixabay.com/photo/2017/09/28/08/58/camera-2794769_960_720.png' }}
                             style={styles.imageStyles}
                             height={36}
                             width={48}
                             borderRadius={0} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex: 0.9, alignSelf: 'flex-end', position: 'absolute'}} onPress={this.flipCamera}>
                        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>{' '}Flip{' '}</Text>
                      </TouchableOpacity>
                  </View>
                    
                  </View>)
      }
    }
}

const styles = StyleSheet.create (
  {
    camera: 
      {
        height: winHeight,
        width: winWidth,
        position: 'absolute',     
        flex: 1
      }
  })

  const mapStateToProps = state => (
    {
        selectedImages: state.UploadImageReducer.selectedImages,
        captions      : state.UploadImageReducer.captions
    }
)

const mapDispatchToProps = dispatch => (
    {
        promptIndex   : (key) => dispatch (uploadImgActions.promptIndex (key)),
        addImageToSend: (img) => dispatch (uploadImgActions.addImageToSend (img)),
        toggleCamera  : () => dispatch (uploadImgActions.toggleCamera ()),
        toggleImages  : () => dispatch (uploadImgActions.toggleImages ()),
    }
)

export default connect (mapStateToProps, mapDispatchToProps)(Cam);