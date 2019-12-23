import { combineReducers } from 'redux';
import CreateProfileDataReducer from './CreateProfileDataReducer';
import CreateThirdPartyDataReducer from './CreateThirdPartyDataReducer'
import uploadMediaReducer from "./uploadMediaReducer"

export default combineReducers({
  CreateProfileDataReducer,
  CreateThirdPartyDataReducer,
  uploadMediaReducer
})
