const setWouldYouRatherDataAction = (wouldYouRatherData) => (dispatch)=> {
  dispatch({
    type: 'ADD_WOULDYOURATHER_DATA',
    PAYLOAD: wouldYouRatherData
  })
}

export default setWouldYouRatherDataAction;
