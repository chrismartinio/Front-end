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

const uploadImages = (imgArr, captions, props, platform, guid) => {
  ImgProcessing.sendImages(imgArr, platform, {
    captions,
    guid: guid
  });
  props.clearImgSelection();
  props.clearCaptions();
};

const PromptSection = props => (
  <ScrollView>
    {/*Gallery Camera Options*/}
    <PromptPanel />

    {/*Upload Button*/}
    <TouchableOpacity
      style={styles.uploadButton}
      onPress={() => {
        if (props.selectedImages[0] === null) {
          return alert("Please take a picture");
        }
        uploadImages(
          props.selectedImages,
          props.captions,
          props,
          Platform,
          props.guid
        );
        props.handleisUploaded()
      }}
    >
      <Text style={{color: "#fff"}}>Upload Photo</Text>
    </TouchableOpacity>
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
