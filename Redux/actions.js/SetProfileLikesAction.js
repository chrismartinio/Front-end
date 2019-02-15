const setProfileLikesAction = (likes) => {
  return {
    type: 'ADD_LIKES',
    PAYLOAD: likes
  }
}

export default setProfileLikesAction;