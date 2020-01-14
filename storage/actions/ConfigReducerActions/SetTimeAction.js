const setTimeAction = time => dispatch => {
  dispatch({
    type: "SET_TIME",
    PAYLOAD: time
  });
};

export default setTimeAction;
