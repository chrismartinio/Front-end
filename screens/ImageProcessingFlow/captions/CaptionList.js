import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";

import { connect } from "react-redux";
import * as uploadImgActions  from "../../../storage/actions/ImageProcessingActions/uploadMediaActions";

import captionListData from "./CaptionListData.js";

import Caption from "./Caption.js";

const CaptionList = props => (
  <ScrollView>
    {captionListData.map((caption, key) => (
      <Caption key={`${key}imageCaption`}>{caption}</Caption>
    ))}

    <Text
      style={[styles.caption, { backgroundColor: "#4a4747", color: "#ffffff" }]}
    >
      (Write your own caption)
    </Text>
  </ScrollView>
);

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
  updateCaptions: caption => dispatch(uploadImgActions.updateCaptions(caption))
});

export default connect()(CaptionList);
