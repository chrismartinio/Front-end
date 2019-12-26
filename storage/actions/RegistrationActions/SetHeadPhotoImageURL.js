const setHeadPhotoImageURL = imageUrl => dispatch => {
  dispatch({
    type: "SET_HEAD_PHOTO_IMAGE_URL",
    PAYLOAD: imageUrl
  });
};

export default setHeadPhotoImageURL;
