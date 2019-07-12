const removeProfileLikesAction = (likes) => (dispatch) => {
   dispatch({
    type: 'REMOVE_LIKES',
    PAYLOAD: likes
  })
}

export default removeProfileLikesAction;
