import { combineReducers } from "redux";
import activitycountReducers from './modifyactivityslice';
export default combineReducers({
    count : activitycountReducers
});