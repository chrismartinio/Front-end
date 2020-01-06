const setProfilePicturesAction = url => dispatch => {
  dispatch({
    type: "SET_DEVICE_USER_IMAGE_URL",
    PAYLOAD: url
  });
};

export default setProfilePicturesAction;
