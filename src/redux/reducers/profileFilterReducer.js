const initialState = {
    reduxFilters: {},
  };
  
  const profileFilterReducer = (state = initialState, action) => {
    switch (action.type) {
      case "profileFilter":
        return {
          ...state,
          reduxFilters: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default profileFilterReducer;
  