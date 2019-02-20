const CreateProfileReducer = (state ={profImage: null, name: null, likes:[]}, action) => {
  switch(action.type){
    case 'ADD_PROFILE_PICTURE':
      return {...state, profImage: action.PAYLOAD};
    case 'ADD_NAME':
      return {...state, name: action.PAYLOAD};
    case 'ADD_LIKES':
      return {
        ...state,
        likes: action.PAYLOAD
      };
    default:
      return state
  }
}

export default CreateProfileReducer