import { server_imageProcessing } from "../../../config/ipconfig";
import axios from "axios";
import Constants from "expo-constants";

const createFormData = (photo, operatingSystem, body) => {
  const data = new FormData();

  data.append("photo", {
    name: "Pic001",
    type: "image",
    uri:
      operatingSystem === "android"
        ? photo.node.image.uri
        : photo.node.image.uri.replace("file://", "")
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

exports.encodeImage = (currentImage, Platform, metaData, cb) => {
  var data = createFormData(currentImage, Platform.OS, metaData);
  cb(data, currentImage.uri);
};

const createFormDataMulti = (images, operatingSystem, body) => {
  const data = new FormData();
  //console.log("BODDYYYYY ", body);
  images.forEach((el, id) => {
    if (el) {
      data.append(`photos`, {
        name: `Pic00${id}`,
        type: "image",
        uri:
          operatingSystem === "android"
            ? el.node.image.uri
            : el.node.image.uri.replace("file://", "")
      });

      data.append("guid", body.guid);
      data.append("caption", body.captions[id]);
    }
  });

  return data;
};

/*
exports.getImages = guid => {
  fetch(`http://${localhost}:4040/api/getImages/${guid}`, {
    method: "GET"
  })
    .then(res => console.log("Upload success!"))
    .catch(err => console.log(err));
};

exports.getAllImages = () => {
  fetch(`http://${localhost}:3001/api/getAllImages`, {
    method: "GET"
  })
    .then(res => console.log(res))
    .catch(err => console.log(err));
};
*/

exports.sendImages = async (images, platform, body) => {
  let data = createFormDataMulti(images, platform.OS, body);

  let success = await fetch(
    `${server_imageProcessing}/api/imageProcessing/uploadProfilePhoto`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: data
    }
  )
    .then(res => {
      //console.log(res);
      return res;
    })
    .then(res => res.json())
    .then(res => {
      if (!res.success && res.status === 422) {
        throw new Error("Invalid");
      }
      if (!res.success) {
        throw new Error("Fail");
      }
      console.log(res.status);
      console.log("Upload success!");
      return { success: true, status: 200 };
    })
    .catch(err => {
      if (err.message === "Invalid") {
        return { success: false, status: 422 };
      } else {
        return { success: false, status: 500 };
      }
    });
  return success;
};
