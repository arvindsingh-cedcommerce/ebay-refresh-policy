const initialState = {
  reduxFilters: {},
};

const returnPolicyGridFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "returnPolicyGridFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default returnPolicyGridFilterReducer;
