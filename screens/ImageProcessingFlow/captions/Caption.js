import React from "react";
import { TouchableHighlight, Text, StyleSheet } from "react-native";

import { connect } from "react-redux";
import * as uploadImgActions from "../../../storage/actions/uploadMediaActions.js";

const Caption = props => {
  updateCaptionsAndToggle = caption => {
    props.updateCaptions(caption);
    props.toggleCaptions();
  };

  return (
    <TouchableHighlight
      onPress={() => {
        updateCaptionsAndToggle(props.children);
      }}
    >
      <Text style={styles.caption}>{props.children}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  caption: {
    borderWidth: 1,
    borderColor: "#dbd9d9",
    height: 50,
    fontSize: 20,
    paddingLeft: 30,
    paddingTop: 10,
    color: "#757474"
  }
});

mapDispatchToProps = dispatch => ({
  updateCaptions: caption => dispatch(uploadImgActions.updateCaptions(caption)),
  toggleCaptions: () => dispatch(uploadImgActions.toggleCaptions())
});

export default connect(
  null,
  mapDispatchToProps
)(Caption);
