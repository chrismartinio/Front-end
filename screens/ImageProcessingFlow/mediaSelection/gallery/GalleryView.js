import React from "react";
import {
  ScrollView,
  View,
  CameraRoll,
  Dimensions,
  StyleSheet
} from "react-native";

import { connect } from "react-redux";
import * as uploadImgActions from "../../../../storage/actions/uploadMediaActions.js";

import ImgTile from "./GalleryTile.js";

class GalleryView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView styles={styles.root}>
        <View style={styles.grid}>
          {this.props.gallery.map((picture, id) => (
            <ImgTile picture={picture} key={`galleryDisplayId${id}`} />
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});

const mapStateToProps = state => ({
  gallery: state.UploadImageReducer.gallery
});

const mapDispatchToProps = dispatch => ({
  retrieveGallery: gallery =>
    dispatch(uploadImgActions.retrieveGallery(gallery))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryView);
