const setProfilePicturesAction = (uri) => (dispatch) => {
  dispatch({
    type: 'ADD_PROFILE_PICTURE',
    PAYLOAD: uri
  })
}

export default setProfilePicturesAction;