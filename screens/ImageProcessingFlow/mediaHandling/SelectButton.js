import React from "react";
import { View, Button, Platform, StyleSheet } from "react-native";

import { connect } from "react-redux";
import * as uploadImgActions from "../../../storage/actions/uploadMediaActions.js";

// helper functions
import { encodeImage } from "./ImageProcessing.js";

const UploadButton = props => {
  addAndSelectImg = imgData => {
    props.addImageToSend(imgData);
    props.selectImage(null);
    props.toggleImages();
  };

  return (
    <View>
      {/* <Button title='Select' onPress={() => {encodeImage (props.selectedImg, Platform, {guid: 'A1555'}, addAndSelectImg)}} /> */}
      <Button
        color="magenta"
        title="Select"
        onPress={() => {
          addAndSelectImg(props.selectedImg);
        }}
      />
    </View>
  );
};

const mapStateToProps = state => ({
  selectedImg: state.UploadImageReducer.selectedImage
});

const mapDispatchToProps = dispatch => ({
  selectImage: img => dispatch(uploadImgActions.selectImage(img)),
  addImageToSend: img => dispatch(uploadImgActions.addImageToSend(img)),
  toggleImages: () => dispatch(uploadImgActions.toggleImages())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadButton);
