const CreateProfileReducer = (state ={profImage: null, profData: null, likes:[null]}, action) => {
  switch(action.type){
    case 'ADD_PROFILE_PICTURE':
      return {...state, profImage: action.PAYLOAD};
    case 'ADD_PROFILE_DATA':
      return {...state, profData: action.PAYLOAD};
    case 'ADD_LIKES':
      return {...state,
        likes:[...state.likes, action.PAYLOAD]
      };
    case 'SET_FIRST_LIKE':
      return {
        ...state,
        likes:[action.PAYLOAD]
      }
    default:
      return state
  }
}

export default CreateProfileReducer
