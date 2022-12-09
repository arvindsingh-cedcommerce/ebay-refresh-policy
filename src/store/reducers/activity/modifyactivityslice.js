import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name : "count",
    initialState: 0,
    reducers: {
        activityAdd : (count, action) => count+1,
        activityRemoveAll : (count, action) => 0,
    }
});

export const { activityAdd, activityRemoveAll } = slice.actions;
export default slice.reducer;