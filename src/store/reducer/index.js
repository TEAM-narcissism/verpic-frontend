import {createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import {getUsers} from './getUsers';

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig = {
    key: "root",
    storage,
  };

const rootReducer = combineReducers({
    getUsers,
})

export default function configureStore() {
    const persist = persistReducer(persistConfig, rootReducer);
    const store = createStore(persist, applyMiddleware(logger));
    return {store};
}