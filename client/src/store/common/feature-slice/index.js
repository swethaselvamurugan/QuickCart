import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    featureImageList: []
}

export const addFeatureImage = createAsyncThunk("/common/addFeatureImage",
    async (image) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/common/feature/add`, { image });
        return response?.data;
    }
);

export const getFeatureImages = createAsyncThunk("/common/getFeatureImages",
    async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/common/feature/get`);
        return response?.data;
    }
);

const commonFeatureSlice = createSlice({
    name: "commonFeature",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFeatureImages.pending, (state) => {
            state.isLoading = true;
        }).addCase(getFeatureImages.fulfilled, (state, action) => {
            console.log(action.payload.data)
            state.isLoading = false;
            state.featureImageList = action.payload.data;
        }).addCase(getFeatureImages.rejected, (state, action) => {
            state.isLoading = false;
            state.featureImageList = [];
        })
    }
});

export default commonFeatureSlice.reducer;