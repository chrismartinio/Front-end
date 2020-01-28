const setOnlineUserListAction = onlineUserList => dispatch => {
  dispatch({
    type: "SET_ONLINE_USER_LIST",
    PAYLOAD: onlineUserList
  });
};

export default setOnlineUserListAction;
