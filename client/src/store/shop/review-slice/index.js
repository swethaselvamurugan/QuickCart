import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    reviews: [],
}

export const addReview = createAsyncThunk("/review/addReview",
    async (formData) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/review/add`, formData );
        return response?.data;
    }
);

export const getReviews = createAsyncThunk("/review/getReviews",
    async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/review/${id}`);
        return response?.data;
    }
);

const shopReviewSlice = createSlice({
    name: "shopReview",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getReviews.pending, (state) => {
            state.isLoading = true;
        }).addCase(getReviews.fulfilled, (state, action) => {
            console.log(action.payload.data)
            state.isLoading = false;
            state.reviews = action.payload.data;
        }).addCase(getReviews.rejected, (state, action) => {
            state.isLoading = false;
            state.reviews = [];
        })
    }
});

export default shopReviewSlice.reducer;