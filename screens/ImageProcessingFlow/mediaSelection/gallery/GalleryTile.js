import React from "react";
import { Image, TouchableHighlight, StyleSheet } from "react-native";

import { connect } from "react-redux";
import * as uploadImgActions  from "../../../../storage/actions/ImageProcessingActions/uploadMediaActions";

const Tile = props => (
  <TouchableHighlight onPress={() => props.selectImage(props.picture)}>
    <Image
      source={{ uri: props.picture.node.image.uri }}
      style={styles.image}
    />
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    margin: 1,
    borderRadius: 3
  }
});

const mapDispatchToProps = dispatch => ({
  selectImage: img => dispatch(uploadImgActions.selectImage(img))
});

export default connect(
  null,
  mapDispatchToProps
)(Tile);
