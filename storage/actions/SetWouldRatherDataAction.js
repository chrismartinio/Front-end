const setWouldRatherDataAction = (wouldRatherData) => (dispatch)=> {
  dispatch({
    type: 'ADD_WOULDRATHER_DATA',
    PAYLOAD: wouldRatherData
  })
}

export default setWouldRatherDataAction;
