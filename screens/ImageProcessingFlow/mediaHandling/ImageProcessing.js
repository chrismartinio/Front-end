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

exports.sendImage = data => {
  fetch("http://localhost:3000/api/testUpload/600/648", {
    method: "POST",
    body: data
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
  })
    .then(res => console.log("Upload success!"))
    .catch(err => console.log(err));
};

exports.encodeImage = (currentImage, Platform, metaData, cb) => {
  var data = createFormData(currentImage, Platform.OS, metaData);
  cb(data, currentImage.uri);
};

const createFormDataMulti = (images, operatingSystem, body) => {
  const data = new FormData();
  console.log("BODDYYYYY ", body);
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

exports.sendImages = (images, platform, body) => {
  let data = createFormDataMulti(images, platform.OS, body);

  fetch("http://localhost:3001/api/uploadImages", {
    method: "POST",
    body: data
  })
    .then(res => console.log("Upload success!"))
    .catch(err => console.log(err));
};
