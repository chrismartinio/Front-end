import React from "react";
import { ExpoConfigView } from "@expo/samples";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
  CameraRoll,
  TouchableHighlight,
  Modal,
  Alert
} from "react-native";

//Redux
import { connect } from "react-redux";

import { server_imageProcessing } from "../../../config/ipconfig";

import LoadingScreen from "../../../sharedComponents/LoadingScreen";

import { StackActions, NavigationActions } from "react-navigation";

const { height, width } = Dimensions.get("window");

class PhotosAlbumModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      photosURI: "",
      selectedPhotoURI: ""
    };
  }

  uploadtoS3 = async () => {
    console.log(`index: ${this.props.selectedPhotoIndex}`);
    console.log(`phone: ${this.state.selectedPhotoURI}`);

    if (this.state.selectedPhotoURI === "") {
      return;
    }
    let images = [this.state.selectedPhotoURI, null, null, null, null, null];

    const data = new FormData();
    images.forEach((el, id) => {
      console.log(el);
      if (el) {
        data.append(`photos`, {
          name: `Pic001`,
          type: "image",
          uri: Platform.OS === "android" ? el : el.replace("file://", "")
        });
        data.append("guid", this.props.CreateProfileDataReducer.guid);
        data.append("index", this.props.selectedPhotoIndex);
      }
    });

    await fetch(
      `${server_imageProcessing}/api/imageProcessing/uploadAlbumPhotos`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: data
      }
    )
      .then(res => res.json())
      .then(res => {
        console.log("RESULT");
        console.log(res)
        if (res.success) {
          this.props.handleUpdateAlbumPhoto(true);
        } else {
          this.props.handleUpdateAlbumPhoto(false);
        }
      })
      .catch(err => {
        this.props.handleUpdateAlbumPhoto(false);
      });

    //upload button
    this.setState({
      selectedPhotoURI: ""
    });
  };

  getPhonePhotos = async () => {
    let photosOBJ = await CameraRoll.getPhotos({
      first: 100000,
      assetType: "Photos",
      groupTypes: "All"
    }).then(photos => photos);

    let photosURI = [];
    photosOBJ.edges.map(photo => {
      let { uri, height, width } = photo.node.image;
      photosURI.push({ uri: uri, height: height, width: width });
    });
    this.setState({
      photosURI: photosURI
    });
  };

  async componentDidMount() {
    //console.log(this.props.CreateProfileDataReducer.guid)
    await this.getPhonePhotos();
    this.setState({
      isSuccess: true
    });
  }

  selectPhoto = photoOBJ => {
    this.setState({
      selectedPhotoURI: photoOBJ.uri
    });
  };

  successScreen = () => {
    let displayPhotos = this.state.photosURI.map((e, index = 0) => {
      return (
        <View key={index++}>
          <TouchableOpacity
            onPress={() => {
              this.selectPhoto(e);
            }}
          >
            <Image
              source={{ uri: e.uri }}
              style={[
                styles.image,
                { borderWidth: this.state.selectedPhotoURI === e.uri ? 5 : 1 }
              ]}
            />
          </TouchableOpacity>
        </View>
      );
    });
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.isAlbumSectionVisible}
        style={{ flex: 1 }}
      >
        <View style={{ padding: "7%" }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/*Close*/}
          <TouchableOpacity
            style={{ margin: 5 }}
            onPress={() => {
              this.props.setAlbumSectionVisible(false);
            }}
          >
            <Text>Close</Text>
          </TouchableOpacity>

          {/*Upload*/}
          <TouchableOpacity
            style={{ margin: 5 }}
            onPress={() => {
              this.uploadtoS3();
            }}
          >
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {displayPhotos}
          </View>
        </ScrollView>
      </Modal>
    );
  };

  loadingScreen = () => {
    //display fetching data
    return <LoadingScreen navigation={this.props.navigation} />;
  };

  render() {
    return this.state.isSuccess ? this.successScreen() : this.loadingScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: width / 3.1,
    height: width / 3.1,
    margin: 1,
    borderWidth: 1,
    borderColor: "#fff"
  }
});

const mapStateToProps = state => {
  return { ...state };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosAlbumModal);
