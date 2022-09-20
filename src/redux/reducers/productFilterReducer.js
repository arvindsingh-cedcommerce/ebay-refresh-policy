const initialState = {
  reduxFilters: {},
};

const productFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "productFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default productFilterReducer;
