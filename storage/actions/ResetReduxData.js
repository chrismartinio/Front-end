const resetReduxData = (likes) => (dispatch) => {
   dispatch({
    type: 'RESET_REDUX_DATA',
    PAYLOAD: true
  })
}

export default resetReduxData;
