const initialState = {
  reduxFilters: {},
};

const orderFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "orderFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default orderFilterReducer;
