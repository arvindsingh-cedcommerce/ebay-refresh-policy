import { combineReducers } from "redux";
import productsReducers from './products/products';
export default combineReducers({
    products : productsReducers
})