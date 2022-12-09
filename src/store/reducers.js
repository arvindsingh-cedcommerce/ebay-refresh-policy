import { combineReducers } from "redux";
import ebayReducer from './reducers/ebay/reducers';
import amazonReducer from './reducers/amazon/reducers';
import activityReducers from "./reducers/activity/activity";
export default combineReducers({
    ebay : ebayReducer,
    amazon: amazonReducer,
    activity : activityReducers
})