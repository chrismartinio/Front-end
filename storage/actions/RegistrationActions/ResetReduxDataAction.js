const resetReduxDataAction = (reduxData) => (dispatch)=> {
  dispatch({
    type: 'RESET_REDUX_DATA',
    PAYLOAD: true
  })
}

export default resetReduxDataAction;
