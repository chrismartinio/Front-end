const setWeekendLocationDataAction = (weekendLocation) => (dispatch)=> {
  dispatch({
    type: 'ADD_WEEKEND_LOCATION_DATA',
    PAYLOAD: weekendLocation
  })
}

export default setWeekendLocationDataAction;
