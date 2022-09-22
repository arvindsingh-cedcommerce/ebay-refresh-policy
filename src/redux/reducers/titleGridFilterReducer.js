const initialState = {
  reduxFilters: {},
};

const titleGridFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "titleFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default titleGridFilterReducer;
