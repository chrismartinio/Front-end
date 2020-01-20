import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";

import AntIcon from "react-native-vector-icons/AntDesign";

import { connect } from "react-redux";
import * as uploadImgActions from "../../../storage/actions/ImageProcessingActions/uploadMediaActions";
const { height, width } = Dimensions.get("window");

const PhotoPrompt = props => {
  addIndexToggleSelection = (key, imageSelect = false) => {
    props.promptIndex(key);
    imageSelect ? props.toggleImages(key) : props.toggleCaptions(key);
  };

  var key = parseInt(props.promptKey);
  //var imageUri = props.selectedImages[key] ? props.selectedImages[key]._parts[0][1].uri : null;
  var imageUri = props.selectedImages[key]
    ? props.selectedImages[key].node.image.uri
    : null;
  //console.log(props.selectedImages);

  var added = imageUri ? (
    <Image style={styles.imagePreview} source={{ uri: imageUri }} />
  ) : (
    <View>
      <View style={styles.iconView}>
        <AntIcon name="camera" color="#6a0dad" size={50} />
      </View>
      <Text style={styles.textStyle}>Take a selfie to use as</Text>
      <Text style={styles.textStyle}>your profile photo</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        //style={styles.addBox}
        onPress={() => {
          addIndexToggleSelection(key, true);
        }}
      >
        {added}
      </TouchableOpacity>

      {/*<TouchableHighlight
        onPress={() => {
          addIndexToggleSelection(key);
        }}
      >
        <Text style={styles.captionText}>{props.captions[key]}</Text>
      </TouchableHighlight>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  addBox: {
    width: width * 0.93,
    height: width * 0.93,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 3,
    borderStyle: "dotted",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  addText: {
    justifyContent: "center",
    textAlign: "center"
  },
  captionText: {
    fontWeight: "bold",
    top: "44%"
  },
  imagePreview: {
    width: width * 0.93,
    height: width * 0.93
  },
  iconView: {
    paddingLeft: width * 0.26,
    paddingRight: width * 0.26,
    alignSelf: "center",
    fontStyle: "italic",
    margin: 50,
    marginTop: height / 3.5
  },
  textStyle: {
    textAlign: "center",
    color: "#6a0dad",
    fontFamily: "HelveticaNeue"
  }
});

const mapStateToProps = state => ({
  selectedImages: state.uploadMediaReducer.selectedImages,
  captions: state.uploadMediaReducer.captions
});

const mapDispatchToProps = dispatch => ({
  promptIndex: key => dispatch(uploadImgActions.promptIndex(key)),
  toggleImages: () => dispatch(uploadImgActions.toggleImages()),
  toggleCaptions: () => dispatch(uploadImgActions.toggleCaptions())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotoPrompt);
