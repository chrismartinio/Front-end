import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  Picker,
  DatePickerIOS,
  TouchableHighlight,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert
} from "react-native";
//Redux
import { connect } from "react-redux";

import LoadingScreen from "../../../../sharedComponents/LoadingScreen";

import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

const { height, width } = Dimensions.get("window");

class BackgroundCheckImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.Constants.Type.back,
      isUploaded: false,
      IDphoto: "",
      isPassed: false,
      isLoading: true,
      isError: false
    };
  }

  componentDidMount = async () => {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const camPermission = camera.status === "granted";

    if (!camPermission) {
      Alert.alert(
        "Fail!",
        "Please allow Camera Permission",
        [
          {
            text: "OK",
            onPress: () => {
              this.props.navigation.goBack();
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      this.setState({ isLoading: false });
    }
  };

  imagePassScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text>Pass</Text>
        <Button
          title={"Back"}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  };

  imageFailScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text>Fail</Text>
        <Button
          title={"Back"}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  };

  imageErrorScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text>Fail</Text>
        <Button
          title={"Back"}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  };

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.setState({ IDphoto: photo });
    }
  };

  usePhoto = () => {
    //upload
    //return true false

    let result = true;
    if (result) {
      this.props.navigation.state.params.handlePassed("backgroundCheck", 1);
      this.setState({ isUploaded: true, isPassed: true });
    } else {
      this.props.navigation.state.params.handlePassed("backgroundCheck", 2);
      this.setState({ isUploaded: true, isPassed: false });
    }
  };

  defaultScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={styles.camera}
          type={this.state.cameraType}
          ref={ref => (this.camera = ref)}
          pictureSize={"640x480"}
        />
        <Text>Default</Text>

        <View style={{ position: "absolute", left: "1.5%", bottom: "3%" }}>
          <Button
            title={"Cancel"}
            color={"#fff"}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
        </View>

        <TouchableOpacity
          onPress={this.takePicture}
          style={{
            position: "absolute",
            bottom: "2%",
            left: "43%"
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: 60,
              height: 60,
              borderRadius: 50,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderWidth: 2,
                borderColor: "black",
                width: 50,
                height: 50,
                borderRadius: 25
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  previewImageScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "#fff"
        }}
      >
        <Image
          style={{
            width: width,
            height: height
          }}
          source={{
            uri: this.state.IDphoto.uri
          }}
        />

        <View
          style={{
            backgroundColor: "#141414",
            height: "10%",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Button
            title={"Retake"}
            color={"#fff"}
            onPress={() => {
              this.setState({ IDphoto: "" });
            }}
          />

          <Button title={"usePhoto"} color={"#fff"} onPress={this.usePhoto} />
        </View>
      </View>
    );
  };

  screenSwitch = () => {
    if (this.state.IDphoto === "") {
      return this.defaultScreen();
    } else {
      if (!this.state.isUploaded) {
        return this.previewImageScreen();
      } else {
        if (this.state.isPassed) {
          return this.imagePassScreen();
        } else {
          if (!this.state.isError) {
            return this.imageFailScreen();
          } else {
            return this.imageErrorScreen();
          }
        }
      }
    }
  };

  loadingScreen = () => {
    return <LoadingScreen navigation={this.props.navigation} />;
  };

  render() {
    return this.state.isLoading ? this.loadingScreen() : this.screenSwitch();
  }
}

const styles = StyleSheet.create({
  camera: {
    height: height,
    width: width,
    position: "absolute",
    flex: 1
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
)(BackgroundCheckImage);
