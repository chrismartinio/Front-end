import React from "react";
import {
  View,
  Text,
  Button,
  CameraRoll,
  TouchableHighlight,
  Image,
  StyleSheet
} from "react-native";

import { connect } from "react-redux";
import * as uploadImgActions from "../../../storage/actions/ImageProcessingActions/uploadMediaActions";

import GalleryView from "./gallery/GalleryView.js";
import CropPanel from "./photoCropping/CropPanel.js";
import SelectButton from "../mediaHandling/SelectButton.js";
import Camera from "./Camera.js";

const UploadSection = props => {
  useGallery = () => {
    props.toggleGallery();

    CameraRoll.getPhotos({
      first: 100000,
      assetType: "Photos",
      groupTypes: "All"
    }).then(gallery => props.retrieveGallery(gallery.edges));
  };

  return (
    <View>
      {!props.gallerySelection && !props.cameraActive && (
        <View>
          <Button title="Gallery" onPress={useGallery} />
          <Button title="Camera" onPress={props.toggleCamera} />
          <Button title="Back" onPress={props.toggleImages} />
        </View>
      )}

      {props.gallerySelection && !props.cameraActive && (
        <View>
          <CropPanel />
          <GalleryView />
          <SelectButton />
          <Button title="Back" onPress={useGallery} />
        </View>
      )}
      {props.cameraActive && !props.gallerySelection && <Camera />}
    </View>
  );
};

const mapStateToProps = state => ({
  gallerySelection: state.uploadMediaReducer.gallerySelection,
  cameraActive: state.uploadMediaReducer.cameraActive
});

const mapDispatchToProps = dispatch => ({
  retrieveGallery: gallery =>
    dispatch(uploadImgActions.retrieveGallery(gallery)),
  toggleCamera: () => dispatch(uploadImgActions.toggleCamera()),
  toggleImages: () => dispatch(uploadImgActions.toggleImages()),
  toggleGallery: () => dispatch(uploadImgActions.toggleGallery())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadSection);
