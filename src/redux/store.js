import { configureStore } from "@reduxjs/toolkit";
import { combineReducers, createStore } from "redux";
import orderFilterReducer from "./reducers/orderFilterReducer";
import productFilterReducer from "./reducers/productFilterReducer";
import profileFilterReducer from "./reducers/profileFilterReducer";
import shippingPolicyGridFilterReducer from "./reducers/shippingPolicyGridFilterReducer";
import paymentPolicyGridFilterReducer from "./reducers/paymentPolicyGridFilterReducer";
import returnPolicyGridFilterReducer from "./reducers/returnPolicyGridFilterReducer";
import categoryGridFilterReducer from "./reducers/categoryGridFilterReducer";
import inventoryGridFilterReducer from "./reducers/inventoryGridFilterReducer";
import priceGridFilterReducer from "./reducers/priceGridFilterReducer";
import titleGridFilterReducer from "./reducers/titleGridFilterReducer";

// const store = createStore(productFilterReducer);
const rootReducer = combineReducers({
  productFilterReducer,
  orderFilterReducer,
  profileFilterReducer,
  paymentPolicyGridFilterReducer,
  shippingPolicyGridFilterReducer,
  returnPolicyGridFilterReducer,
  categoryGridFilterReducer,
  inventoryGridFilterReducer,
  priceGridFilterReducer,
  titleGridFilterReducer,
});
const store = createStore(rootReducer);
// console.log(store.getState());

// const store = configureStore(productFilterReducer)

export default store;
