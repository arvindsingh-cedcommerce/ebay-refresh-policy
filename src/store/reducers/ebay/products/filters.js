import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name : "filters",
    initialState: [],
    reducers: {
        filterUpdated : (filters, action) => [...action.payload]
    }
});

export const { filterUpdated } = slice.actions;
export default slice.reducer;