import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
  Button
} from "react-native";
import { Icon } from "react-native-elements";
import AntIcon from "react-native-vector-icons/AntDesign";

import { connect } from "react-redux";
import * as uploadImgActions from "../../../storage/actions/ImageProcessingActions/uploadMediaActions";

import PromptPanel from "./PromptPanel.js";

import ImgProcessing from "../mediaHandling/ImageProcessing.js";
const { height, width } = Dimensions.get("window");

const uploadImages = async (
  imgArr,
  captions,
  props,
  platform,
  guid,
  handleisUploaded
) => {
  let success = await ImgProcessing.sendImages(imgArr, platform, {
    captions,
    guid: guid
  });
  if (success) {
    handleisUploaded();
    props.clearImgSelection();
    props.clearCaptions();
  } else {
    alert("Failed Upload. Please try again!");
  }
};

const PromptSection = props => (
  <ScrollView>
    {/*Gallery Camera Options*/}
    {/* <PromptPanel /> */}
    <View style={styles.iconView}>
      <AntIcon name="camera" color="#6a0dad" size={50} />
    </View>
    

    {/*Upload Button*/}
    <View style={styles.textView}>
        <Text style={styles.textStyle}>Take a selfie to use as</Text>
        <Text style={styles.textStyle}>your profile photo</Text>

          {/* <Button
            title="Upload Photo"
            onPress={e => this.localLogin(e)}
            color="white"
            key="100"
            onPress={() => {
              if (props.selectedImages[0] === null) {
                return alert("Please take a picture");
              }
      
              console.log(props.selectedImages)
              console.log(props.guid)
              uploadImages(
                props.selectedImages,
                props.captions,
                props,
                Platform,
                props.guid,
                props.handleisUploaded
              );
            }}
          /> */}
        </View>
    {/* <TouchableOpacity
      style={styles.uploadButton}
      onPress={() => {
        if (props.selectedImages[0] === null) {
          return alert("Please take a picture");
        }

        console.log(props.selectedImages)
        console.log(props.guid)
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
      <Text style={{ color: "white" }}>Upload Photo</Text>
    </TouchableOpacity> */}
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
    borderRadius: 20,
    color: "white",
    backgroundColor: "#6a0dad",
    paddingLeft: width * 0.26,
    paddingRight: width * 0.26,
    alignSelf: "center",
    fontStyle: "italic",
    margin: 5
  },
  buttonStyle: {
    borderRadius: 20,
    color: "white",
    backgroundColor: "#6a0dad",
    paddingLeft: width * 0.26,
    paddingRight: width * 0.26,
    alignSelf: "center",
    fontStyle: "italic",
    margin: 5
  },
    textView: {
      color: "#6a0dad",
      paddingLeft: width * 0.26,
      paddingRight: width * 0.26,
      alignSelf: "center",
      fontStyle: "italic",
      textAlign: "center",
      margin: 5
    },
    textStyle: {
      textAlign: "center",
      color: "#6a0dad",
      fontFamily: "HelveticaNeue"
    },
  iconView: {
    paddingLeft: width * 0.26,
    paddingRight: width * 0.26,
    alignSelf: "center",
    fontStyle: "italic",
    margin: 50,
    marginTop: height/3.5
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
