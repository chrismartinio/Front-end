const setWeekendLocationDataAction = (weekendLocationData) => (dispatch)=> {
  dispatch({
    type: 'ADD_WEEKEND_LOCATION_DATA',
    PAYLOAD: weekendLocationData
  })
}

export default setWeekendLocationDataAction;
