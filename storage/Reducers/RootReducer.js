import { combineReducers } from 'redux';
import CreateProfileDataReducer from './CreateProfileDataReducer';
import CreateThirdPartyDataReducer from './CreateThirdPartyDataReducer'
import uploadMediaReducer from "./uploadMediaReducer"
import ConfigReducer from "./ConfigReducer"

export default combineReducers({
  CreateProfileDataReducer,
  CreateThirdPartyDataReducer,
  uploadMediaReducer,
  ConfigReducer
})
