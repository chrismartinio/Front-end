const setNewMatchlistAction = matchlist => dispatch => {
  dispatch({
    type: "SET_NEW_MATCH_LIST",
    PAYLOAD: matchlist
  });
};

export default setNewMatchlistAction;
