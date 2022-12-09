const initialState = {
    reduxFilters: {},
  };
  
  const disabledProductFilterReducer = (state = initialState, action) => {
    switch (action.type) {
      case "disabledProductFilter":
        return {
          ...state,
          reduxFilters: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default disabledProductFilterReducer;
  