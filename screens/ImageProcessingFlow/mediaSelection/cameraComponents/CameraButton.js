import React from "react";
import { Text, TouchableOpacity, Image, View, StyleSheet } from "react-native";

// const takePicture = async () => {
//     console.log(this.camera)
//     if (this.camera) {
//       let photo = await this.camera.takePictureAsync({
//         quality:1,
//         base64:false,
//         exif:false,
//         onPictureSaved: this.handlePicture,

//       });

//       console.log(photo)
// }

const takePicture = async camera => {
  console.log(camera);
};

const CameraButton = props => (
  <TouchableOpacity style={{ flex: 1 }} onPress={() => takePicture(props.cam)}>
    <Image
      source={{
        uri:
          "https://cdn.pixabay.com/photo/2017/09/28/08/58/camera-2794769_960_720.png"
      }}
      style={styles.imageStyles}
      height={36}
      width={48}
      borderRadius={0}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  action: {
    color: "white",
    justifyContent: "space-around",
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center"
  }
});

export default CameraButton;
