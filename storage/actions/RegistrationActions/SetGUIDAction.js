const setGUIDAction = guid => dispatch => {
  dispatch({
    type: "SET_GUID",
    PAYLOAD: guid
  });
};

export default setGUIDAction;
