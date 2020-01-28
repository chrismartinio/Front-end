import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet
} from "react-native";

import { connect } from "react-redux";
import * as uploadImgActions from "../../../storage/actions/ImageProcessingActions/uploadMediaActions";

import PromptPanel from "./PromptPanel.js";

import ImgProcessing from "../mediaHandling/ImageProcessing.js";

const uploadImages = async (
  imgArr,
  captions,
  props,
  platform,
  guid,
  handleisUploaded
) => {
  let imageResult = await ImgProcessing.sendImages(imgArr, platform, {
    captions,
    guid: guid
  });
  if (imageResult.success) {
    handleisUploaded();
    props.clearImgSelection();
    props.clearCaptions();
  } else if (!imageResult.success && imageResult.status === 422) {
    alert("Ops! Your selfie is not a face. Please try again!");
  } else {
    alert("Failed Upload. Please try again!");
  }
};

const PromptSection = props => (
  <ScrollView>
    {/*Gallery Camera Options*/}
    <PromptPanel />

    {/*Upload Button*/}
    {props.selectedImages[0] !== null && (
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => {
          if (props.selectedImages[0] === null) {
            return alert("Please take a picture");
          }

          console.log(props.selectedImages);
          console.log(props.guid);
          uploadImages(
            props.selectedImages,
            props.captions,
            props,
            Platform,
            props.guid,
            props.handleisUploaded
          );
        }}
      >
        <Text style={{ color: "#fff" }}>Upload Photo</Text>
      </TouchableOpacity>
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  titleText: {
    fontWeight: "bold",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
    color: "grey"
  },
  captionSection: {
    display: "flex"
  },
  uploadButton: {
    backgroundColor: "#e300d8",
    alignItems: "center",
    padding: 10,
    margin: 15,
    borderRadius: 5
  }
});

const mapStateToProps = (state, ownProps) => {
  const reducer = state.uploadMediaReducer;
  const profileReducer = state.CreateProfileDataReducer;

  return {
    gallery: reducer.gallery,
    imageSelection: reducer.imageSelection,
    captionSelection: reducer.captionSelection,
    selectedImages: reducer.selectedImages,
    captions: reducer.captions,
    guid: profileReducer.guid
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  clearImgSelection: () => dispatch(uploadImgActions.clearImgSelection()),
  clearCaptions: () => dispatch(uploadImgActions.clearCaptions())
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PromptSection);

// arr.filter (el => el === null)
