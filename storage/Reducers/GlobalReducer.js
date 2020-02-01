let initialState = {
  onlineUserList: [],
  footer_currentScreen: ""
};

const GlobalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ONLINE_USER_LIST":
      return {
        ...state,
        onlineUserList: action.PAYLOAD.onlineUserList
      };
    case "SET_FOOTER_CURRENT_SCREEN":
      return {
        ...state,
        footer_currentScreen: action.PAYLOAD.footer_currentScreen
      };
    default:
      return state;
  }
};

export default GlobalReducer;
