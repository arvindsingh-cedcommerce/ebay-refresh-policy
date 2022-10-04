const initialState = {
  reduxFilters: {},
};

const categoryGridFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "categoryFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default categoryGridFilterReducer;
