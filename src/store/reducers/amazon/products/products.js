import { combineReducers } from "redux";
import filterReducers from './filters';
export default combineReducers({
    filters : filterReducers
});