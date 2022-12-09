const initialState = {
  reduxFilters: {},
};

const inventoryGridFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "inventoryFilter":
      return {
        ...state,
        reduxFilters: action.payload,
      };
    default:
      return state;
  }
};

export default inventoryGridFilterReducer;
