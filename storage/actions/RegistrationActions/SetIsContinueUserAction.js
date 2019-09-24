const setIsContinueUserAction = (isContinueUserData) => (dispatch)=> {
  dispatch({
    type: 'SET_IS_CONTINUE_USER',
    PAYLOAD: isContinueUserData
  })
}

export default setIsContinueUserAction;
