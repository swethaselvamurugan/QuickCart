import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    searchResults: [],
}

export const getSeachResults = createAsyncThunk("/search/getSeachResults",
    async (keyword) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`);
        return response?.data;
    }
);

const shopSearchSlice = createSlice({
    name: "shopSearch",
    initialState,
    reducers: {
        resetSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSeachResults.pending, (state) => {
            state.isLoading = true;
        }).addCase(getSeachResults.fulfilled, (state, action) => {
            console.log(action.payload.data)
            state.isLoading = false;
            state.searchResults = action.payload.data;
        }).addCase(getSeachResults.rejected, (state, action) => {
            state.isLoading = false;
            state.searchResults = [];
        })
    }
});

export const { resetSearchResults } = shopSearchSlice.actions;
export default shopSearchSlice.reducer;