const setGUIAction = gui => dispatch => {
  dispatch({
    type: "SET_GUI",
    PAYLOAD: gui
  });
};

export default setGUIAction;
