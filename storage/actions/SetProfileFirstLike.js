const SetProfileFirstLike = (payload) => (dispatch) => {
  dispatch({
    type: 'SET_FIRST_LIKE',
    PAYLOAD: payload
  })
}

export default SetProfileFirstLike