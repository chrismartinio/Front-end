const setProfileLikesAction = (likes) => (dispatch) => {
   dispatch({
    type: 'ADD_LIKES',
    PAYLOAD: likes
  })
}

export default setProfileLikesAction;