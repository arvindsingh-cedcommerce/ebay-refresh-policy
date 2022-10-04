const initialState = {
  reduxFilters: {},
};

const paymentPolicyGridFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "paymentPolicyGridFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default paymentPolicyGridFilterReducer;
