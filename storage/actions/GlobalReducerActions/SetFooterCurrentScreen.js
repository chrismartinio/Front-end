const setFooterCurrentScreen = footer_currentScreen => dispatch => {
  dispatch({
    type: "SET_FOOTER_CURRENT_SCREEN",
    PAYLOAD: footer_currentScreen
  });
};

export default setFooterCurrentScreen;
