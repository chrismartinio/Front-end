const InsertDummyData = (payload) => (dispatch) => {
  dispatch({
    type: 'INSERT_DUMMY_DATA',
    PAYLOAD: payload
  })
}

export default InsertDummyData
