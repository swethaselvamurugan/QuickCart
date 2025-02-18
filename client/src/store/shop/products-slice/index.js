import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null
}

export const fetchAllFilteredProducts = createAsyncThunk("/products/fetchAllProducts",
    async ({filterParams, sortParams}) => {
        const query = new URLSearchParams({...filterParams, sortBy: sortParams});
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`);
        return response?.data;
    }
);

export const fetchProductDetails = createAsyncThunk("/products/fetchProductDetails",
    async (id) => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`);
        return response?.data;
    }
);

const shopProductsSlice = createSlice({
    name: "shopProducts",
    initialState,
    reducers: {
        setProductDetails: (state, action) => {state.productDetails = null}
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllFilteredProducts.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            console.log(action.payload.data)
            state.isLoading = false;
            state.productList = action.payload.data;
        }).addCase(fetchAllFilteredProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.productList = [];
        }).addCase(fetchProductDetails.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchProductDetails.fulfilled, (state, action) => {
            console.log(action.payload.data)
            state.isLoading = false;
            state.productDetails = action.payload.data;
        }).addCase(fetchProductDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.productDetails = [];
        })
    }
});

export const {setProductDetails} = shopProductsSlice.actions;
export default shopProductsSlice.reducer;