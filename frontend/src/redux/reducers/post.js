import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const postReducer = createReducer(initialState, {
  postCreateRequest: (state) => {
    state.isLoading = true;
  },
  postCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.post = action.payload;
    state.success = true;
  },
  postCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  // get all posts of shop
  getAllpostsShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllpostsShopSuccess: (state, action) => {
    state.isLoading = false;
    state.posts = action.payload;
  },
  getAllpostsShopFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // delete post of a shop
  deletepostRequest: (state) => {
    state.isLoading = true;
  },
  deletepostSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deletepostFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all posts 
  getAllpostsRequest: (state) => {
    state.isLoading = true;
  },
  getAllpostsSuccess: (state, action) => {
    state.isLoading = false;
    state.allPosts = action.payload;
  },
  getAllpostsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
