import { combineReducers } from 'redux';
import CreateProfileDataReducer from './CreateProfileDataReducer';
import CreateThirdPartyDataReducer from './CreateThirdPartyDataReducer'

export default combineReducers({
  CreateProfileDataReducer,
  CreateThirdPartyDataReducer
})
