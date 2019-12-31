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
      <Text style={[{ fontSize: 70 }, styles.addText]}>+</Text>
      <Text style={[{ fontSize: 15 }, styles.addText]}>Add</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addBox}
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
    borderStyle: 'dotted',
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
    height: width * 0.93,
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
