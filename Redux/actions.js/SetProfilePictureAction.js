const setProfilePicturesAction = (uri) => {
  return {
    type: 'ADD_PROFILE_PICTURE',
    PAYLOAD: uri
  }
}

export default setProfilePicturesAction;