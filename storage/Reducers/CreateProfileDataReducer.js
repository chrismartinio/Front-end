let initialState = {
  isContinueUser: false,
  isThirdPartiesServiceUser: false,
  checklist: {
    createAccount: false,
    aboutYou: false,
    preferences: false,
    interests: false,
    wouldYouRather: false,
    localDestination: false,
    imageProcessing: false
  },
  guid: null,
  createAccountData: null,
  aboutYouData: null,
  preferencesData: null,
  interestsData: null,
  wouldYouRatherData: null,
  localDestinationData: null,
  headPhotoImageUrl: null
};

const CreateProfileDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_IS_CONTINUE_USER":
      return {
        ...state,
        isContinueUser: action.PAYLOAD.isContinueUser,
        checklist: action.PAYLOAD.checklist
      };
    case "SET_IS_THIRD_PARTY_SERVICES_USER":
      return {
        ...state,
        isThirdPartiesServiceUser: action.PAYLOAD.isThirdPartiesServiceUser
      };
    case "SET_GUID":
      return { ...state, guid: action.PAYLOAD.guid };
    case "ADD_CREATEACCOUNT_DATA":
      return { ...state, createAccountData: action.PAYLOAD };
    case "ADD_ABOUTYOU_DATA":
      return { ...state, aboutYouData: action.PAYLOAD };
    case "ADD_PREFERENCES_DATA":
      return { ...state, preferencesData: action.PAYLOAD };
    case "ADD_INTERESTS_DATA":
      return { ...state, interestsData: action.PAYLOAD };
    case "ADD_WOULDYOURATHER_DATA":
      return { ...state, wouldYouRatherData: action.PAYLOAD };
    case "ADD_LOCALDESTINATION_DATA":
      return { ...state, localDestinationData: action.PAYLOAD };
    case "SET_HEAD_PHOTO_IMAGE_URL":
      return { ...state, headPhotoImageUrl: action.PAYLOAD.imageUrl };
    case "RESET_REDUX_DATA":
      return initialState;
    case "SET_USER_ALL_DATA":
      return {
        ...state,
        isContinueUser: true,
        createAccountData: action.PAYLOAD.createAccountData,
        aboutYouData: action.PAYLOAD.aboutYouData,
        preferencesData: action.PAYLOAD.preferencesData,
        interestsData: action.PAYLOAD.interestsData,
        wouldYouRatherData: action.PAYLOAD.wouldYouRatherData,
        localDestinationData: action.PAYLOAD.localDestinationData
      };
    case "SET_CHECKLIST":
      return {
        ...state,
        checklist: action.PAYLOAD.checklist
      };
    default:
      return state;
  }
};

export default CreateProfileDataReducer;
