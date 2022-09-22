const initialState = {
  reduxFilters: {},
};

const priceGridFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "priceFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default priceGridFilterReducer;
