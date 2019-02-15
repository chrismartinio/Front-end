import { createStore, applyMiddleware } from 'redux';
import axios from 'axios'
import axiospromisemiddleware from 'axios-promise-middlware';
import thunk from 'redux-thunk'
import logger from 'redux-logger'
// need to imoprt root reducer
import rootReducer from './Reducers/RootReducer'


const middleware = applyMiddleware(thunk, logger, axiospromisemiddleware)
const store = createStore(rootReducer, middleware)


export default store;

