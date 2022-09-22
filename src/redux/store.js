import { configureStore } from "@reduxjs/toolkit";
import { combineReducers, createStore } from "redux";
import orderFilterReducer from "./reducers/orderFilterReducer";
import productFilterReducer from "./reducers/productFilterReducer";
import profileFilterReducer from "./reducers/profileFilterReducer";
import shippingPolicyGridFilterReducer from "./reducers/shippingPolicyGridFilterReducer";
import paymentPolicyGridFilterReducer from "./reducers/paymentPolicyGridFilterReducer";
import returnPolicyGridFilterReducer from "./reducers/returnPolicyGridFilterReducer";

// const store = createStore(productFilterReducer);
const rootReducer = combineReducers({
  productFilterReducer,
  orderFilterReducer,
  profileFilterReducer,
  paymentPolicyGridFilterReducer,
  shippingPolicyGridFilterReducer,
  returnPolicyGridFilterReducer,
});
const store = createStore(rootReducer);
// console.log(store.getState());

// const store = configureStore(productFilterReducer)

export default store;
