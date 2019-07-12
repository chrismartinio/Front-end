const RemoveWeekendLocationDataAction = (weekendLocation) => (dispatch)=> {
  dispatch({
    type: 'REMOVE_WEEKEND_LOCATION_DATA',
    PAYLOAD: weekendLocation
  })
}

export default RemoveWeekendLocationDataAction;
