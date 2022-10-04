const initialState = {
  reduxFilters: {},
};

const shippingPolicyGridFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "shippingPolicyGridFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default shippingPolicyGridFilterReducer;
